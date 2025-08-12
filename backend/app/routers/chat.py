
from __future__ import annotations

import json
import os
import re
import uuid
from datetime import datetime
from typing import Any, Dict, Generator, List, Optional

from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from openai import APIStatusError, OpenAI

from ..config import get_settings
from ..db import get_session
from ..models import ChatSession, Message
from ..retrieval.retriever import get_retriever
from ..rag.vector_store import FaissVectorStore
from ..schemas import ChatRequest, ChatResponse
from ..utils.guardrails import (
    SYSTEM_POLICY_PROMPT,
    has_prompt_injection,
    is_in_allowed_domain,
    _normalize_for_matching,
)

router = APIRouter(tags=["chat"])


DOMAIN_CATS = {
    "gizli": ["gizli-ilimler", "havas"],
    "kuran": ["kuran", "tefsir"],
    "hadis": ["hadis"],
}


def _ensure_session(session_id: str | None) -> str:
    if session_id:
        with get_session() as db:
            sess = db.get(ChatSession, session_id)
            if sess is None:
                raise HTTPException(status_code=404, detail="Oturum bulunamadı")
        return session_id
    new_id = str(uuid.uuid4())
    with get_session() as db:
        db.add(ChatSession(id=new_id))
        db.commit()
    return new_id


def _save_message(session_id: str, role: str, content: str) -> None:
    with get_session() as db:
        db.add(Message(session_id=session_id, role=role, content=content))
        chat = db.get(ChatSession, session_id)
        if chat:
            chat.updated_at = datetime.utcnow()
        db.commit()


def _load_recent_messages(session_id: str, limit: int = 12) -> List[Dict[str, str]]:
    with get_session() as db:
        rows = (
            db.query(Message)
            .filter(Message.session_id == session_id)
            .order_by(Message.created_at.asc())
            .all()
        )
    messages = [{"role": m.role, "content": m.content} for m in rows][-limit:]
    return messages


def _select_categories(query: str) -> Optional[List[str]]:
    # Heuristik sınıflandırma: normalize et ve anahtar kelimelerle kategori belirle
    norm = _normalize_for_matching(query)
    gizli_markers = [
        "gizli ilimler hazinesi", "mustafa iloglu", "havas", "ruhaniyat", "vird"
    ]
    if any(m in norm for m in gizli_markers):
        return DOMAIN_CATS["gizli"]
    hadis_markers = ["hadis", "bukhari", "muslim", "rivayet"]
    if any(m in norm for m in hadis_markers):
        return DOMAIN_CATS["hadis"]
    kuran_markers = ["kuran", "ayet", "sure", "tefsir", "fatiha", "bakara", "nisa", "yasin"]
    if any(m in norm for m in kuran_markers):
        return DOMAIN_CATS["kuran"]
    return None


def _language_system_prompt(lang: str) -> str:
    # Varsayılan Türkçe
    if lang == "ar":
        return (
            "Yalnızca Arapça yanıt ver. Gerekmedikçe Türkçe ekleme yapma. "
            "Kaynak atıflarını kısa tut."
        )
    if lang == "both":
        return (
            "Yanıtı iki dilde ver. Önce Arapça, sonra Türkçe. Format:\n"
            "Arapça:\n<arapca>\n\nTürkçe:\n<turkce>\n"
        )
    # 'tr' ve 'auto' için Türkçe
    return (
        "Yalnızca Türkçe yanıt ver. Arapça ayet/hadis metni gerekiyorsa kısa alıntı yapıp "
        "Türkçe açıklamayı esas al."
    )


@router.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest) -> Any:
    settings = get_settings()
    session_id = _ensure_session(req.session_id)

    user_text = req.query.strip()

    if has_prompt_injection(user_text):
        refusal = (
            "Güvenlik: Prompt injection tespit edildi. Lütfen talebinizi daha doğal bir dille,"
            " kapsam dahilindeki kaynaklarla ilgili olacak şekilde tekrar ifade ediniz."
        )
        _save_message(session_id, "user", user_text)
        _save_message(session_id, "assistant", refusal)
        return ChatResponse(session_id=session_id, content=refusal, citations=[], language=req.language)

    if not is_in_allowed_domain(user_text):
        refusal = (
            "Bu asistan yalnızca Kur'ân, sahih hadis ve Mustafa İloğlu'nun Gizli İlimler Hazinesi kapsamındaki"
            " havas ilimleri hakkında yardımcı olabilir. Lütfen soruyu bu kapsamda tekrar ifade ediniz."
        )
        _save_message(session_id, "user", user_text)
        _save_message(session_id, "assistant", refusal)
        return ChatResponse(session_id=session_id, content=refusal, citations=[], language=req.language)

    # Retrieval
    retriever = get_retriever()
    allowed_categories = _select_categories(user_text)
    vs = FaissVectorStore(index_dir=os.path.join(os.path.dirname(__file__), "..", "app_data", "faiss"))
    vhits = vs.search(user_text, k=5, allowed_categories=allowed_categories)
    v_as_chunks = []
    for m, sc in vhits:
        class M: pass
        mc = M(); mc.text=m.text; mc.source=m.source; mc.chunk_id=m.chunk_id
        v_as_chunks.append((mc, sc))
    bm_hits = retriever.retrieve(user_text, k=5, allowed_categories=allowed_categories)
    seen=set(); hits=[]
    for pair in v_as_chunks + bm_hits:
        key=(pair[0].source, pair[0].chunk_id)
        if key in seen: continue
        seen.add(key); hits.append(pair)
    hits = hits[:5]
    citations: List[str] = []
    context_blocks: List[str] = []
    for doc, score in hits:
        citations.append(f"{doc.source}#{doc.chunk_id}")
        context_blocks.append(f"[Kaynak] {os.path.basename(doc.source)} ({doc.chunk_id})\n{doc.text}")

    context_text = "\n\n".join(context_blocks)

    # Build messages
    messages: List[Dict[str, str]] = []
    messages.append({"role": "system", "content": SYSTEM_POLICY_PROMPT})

    # Dil talimatı: auto -> tr varsayılan
    lang = req.language if req.language != "auto" else "tr"
    messages.append({"role": "system", "content": _language_system_prompt(lang)})

    if context_text:
        messages.append({"role": "system", "content": f"BAĞLAM:\n{context_text}"})

    history_messages = _load_recent_messages(session_id)
    for m in history_messages:
        if m["role"] in ("user", "assistant"):
            messages.append(m)

    messages.append({"role": "user", "content": user_text})

    _save_message(session_id, "user", user_text)

    client = OpenAI(base_url=settings.hf_api_base, api_key=settings.hf_token)

    if req.stream:
        def token_stream() -> Generator[bytes, None, None]:
            try:
                stream = client.chat.completions.create(
                    model=settings.model,
                    messages=messages,
                    temperature=req.temperature,
                    top_p=req.top_p,
                    max_tokens=req.max_tokens,
                    stream=True,
                )
                accumulated: List[str] = []
                for chunk in stream:
                    delta = getattr(chunk.choices[0].delta, "content", None)
                    if delta:
                        accumulated.append(delta)
                        payload = {"token": delta, "done": False}
                        yield (f"data: {json.dumps(payload, ensure_ascii=False)}\n\n").encode("utf-8")
                final_text = "".join(accumulated)
                _save_message(session_id, "assistant", final_text)
                done_payload = {"token": "", "done": True, "session_id": session_id, "citations": citations}
                yield (f"data: {json.dumps(done_payload, ensure_ascii=False)}\n\n").encode("utf-8")
            except APIStatusError as e:
                err_payload = {"error": str(e)}
                yield (f"data: {json.dumps(err_payload, ensure_ascii=False)}\n\n").encode("utf-8")
        headers = {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        }
        return StreamingResponse(token_stream(), headers=headers)

    try:
        comp = client.chat.completions.create(
            model=settings.model,
            messages=messages,
            temperature=req.temperature,
            top_p=req.top_p,
            max_tokens=req.max_tokens,
            stream=False,
        )
        content = comp.choices[0].message.content or ""
    except Exception as e:  # noqa: BLE001
        content = (
            "Model cevabı alınamadı. Lütfen HF_TOKEN ayarınızı ve ağ bağlantınızı kontrol ediniz. "
            f"Hata: {e}"
        )
    _save_message(session_id, "assistant", content)
    return ChatResponse(session_id=session_id, content=content, citations=citations, language=lang)
