
from __future__ import annotations

import json
import os
from typing import Dict, Tuple

import fitz  # PyMuPDF

from ..retrieval.retriever import build_global_retriever, get_retriever
from ..rag.vector_store import FaissVectorStore

STATE_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'app_data', 'ingest_state.json'))
UPLOADS_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'uploads', 'pdf'))
DATA_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'data'))
INDEX_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'app_data', 'faiss'))


def _load_state() -> Dict[str, float]:
    if os.path.exists(STATE_PATH):
        try:
            with open(STATE_PATH, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception:
            return {}
    return {}


def _save_state(state: Dict[str, float]) -> None:
    os.makedirs(os.path.dirname(STATE_PATH), exist_ok=True)
    with open(STATE_PATH, 'w', encoding='utf-8') as f:
        json.dump(state, f, ensure_ascii=False, indent=2)


def _pdf_to_txt(pdf_path: str) -> str:
    texts = []
    with fitz.open(pdf_path) as doc:
        for page in doc:
            texts.append(page.get_text('text'))
    return '\n\n'.join(t for t in texts if t)


def _target_txt_path(pdf_path: str, category: str) -> str:
    fname = os.path.splitext(os.path.basename(pdf_path))[0] + '.txt'
    dest_dir = os.path.join(DATA_ROOT, category)
    os.makedirs(dest_dir, exist_ok=True)
    return os.path.join(dest_dir, fname)


def auto_ingest_new_uploads(uploads_root: str | None = None) -> Tuple[int, int]:
    uploads_root = os.path.abspath(uploads_root or UPLOADS_ROOT)
    os.makedirs(uploads_root, exist_ok=True)
    state = _load_state()
    converted = 0
    scanned = 0

    for root, _dirs, files in os.walk(uploads_root):
        # category is top-level folder under uploads_root
        rel = os.path.relpath(root, uploads_root)
        if rel.startswith('..'):
            continue
        parts = [] if rel == '.' else rel.split(os.sep)
        category = parts[0] if parts else 'root'
        for fname in files:
            if not fname.lower().endswith('.pdf'):
                continue
            fpath = os.path.join(root, fname)
            scanned += 1
            mtime = os.path.getmtime(fpath)
            key = os.path.relpath(fpath, uploads_root)
            if state.get(key) and state[key] >= mtime:
                continue
            # convert
            txt = _pdf_to_txt(fpath)
            out_txt = _target_txt_path(fpath, category=category)
            with open(out_txt, 'w', encoding='utf-8') as f:
                f.write(txt)
            state[key] = mtime
            converted += 1

    if converted > 0:
        # rebuild indexes
        build_global_retriever()
        vs = FaissVectorStore(index_dir=INDEX_DIR)
        vs.build_from_retriever(get_retriever())
        _save_state(state)
    return scanned, converted
