
from __future__ import annotations

import threading
from functools import lru_cache
from typing import List

import numpy as np
from sentence_transformers import SentenceTransformer

_MODEL_NAME = 'sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2'

_model_lock = threading.Lock()
_model: SentenceTransformer | None = None


def _load_model() -> SentenceTransformer:
    global _model
    if _model is None:
        with _model_lock:
            if _model is None:
                _model = SentenceTransformer(_MODEL_NAME)
    return _model  # type: ignore[return-value]


def embed_texts(texts: List[str], batch_size: int = 64) -> np.ndarray:
    model = _load_model()
    embs = model.encode(texts, batch_size=batch_size, show_progress_bar=False, normalize_embeddings=True)
    if not isinstance(embs, np.ndarray):
        embs = np.asarray(embs)
    return embs.astype('float32')

