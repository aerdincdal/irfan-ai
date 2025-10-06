
from __future__ import annotations

import os
from typing import Any, List

import fitz  # PyMuPDF
from fastapi import APIRouter, File, HTTPException, UploadFile

from ..retrieval.retriever import build_global_retriever, get_retriever

router = APIRouter(prefix="/ingest", tags=["ingest"])


def _save_upload(tmp_dir: str, up: UploadFile, category: str) -> str:
    os.makedirs(tmp_dir, exist_ok=True)
    safe_name = up.filename or 'upload.pdf'
    out_path = os.path.join(tmp_dir, safe_name)
    with open(out_path, 'wb') as f:
        f.write(up.file.read())
    # move into category under data root
    data_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'data'))
    target_dir = os.path.join(data_root, category)
    os.makedirs(target_dir, exist_ok=True)
    final_path = os.path.join(target_dir, safe_name)
    os.replace(out_path, final_path)
    return final_path


def _pdf_to_texts(pdf_path: str) -> List[str]:
    texts: List[str] = []
    with fitz.open(pdf_path) as doc:
        for page in doc:
            txt = page.get_text("text")
            if txt:
                texts.append(txt)
    return texts


@router.post('/pdf')
async def ingest_pdf(category: str, file: UploadFile = File(...)) -> Any:
    if not file.filename or not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail='PDF bekleniyor')
    # category: gizli-ilimler | kuran | hadis | havas | ...
    saved = _save_upload('/tmp/irfan_uploads', file, category=category)
    # extract and save as .txt alongside for retriever
    texts = _pdf_to_texts(saved)
    txt_path = saved.rsplit('.', 1)[0] + '.txt'
    with open(txt_path, 'w', encoding='utf-8') as f:
        f.write('\n\n'.join(texts))
    # re-build retriever index
    build_global_retriever()
    return {"ok": True, "saved": saved, "txt": txt_path}


@router.post('/reindex')
async def reindex() -> Any:
    build_global_retriever()
    return {"ok": True}
