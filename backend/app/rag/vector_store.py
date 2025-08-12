
from __future__ import annotations

import json
import os
from dataclasses import dataclass, asdict
from typing import List, Tuple, Optional

import faiss  # type: ignore
import numpy as np

from ..retrieval.retriever import LocalTextRetriever
from .embeddings import embed_texts


@dataclass
class VectorMeta:
    text: str
    source: str
    chunk_id: str
    category: str


class FaissVectorStore:
    def __init__(self, index_dir: str) -> None:
        self.index_dir = os.path.abspath(index_dir)
        os.makedirs(self.index_dir, exist_ok=True)
        self.index_path = os.path.join(self.index_dir, 'index.faiss')
        self.meta_path = os.path.join(self.index_dir, 'meta.json')
        self.index: Optional[faiss.Index] = None
        self.metas: List[VectorMeta] = []

    def _save(self) -> None:
        assert self.index is not None
        faiss.write_index(self.index, self.index_path)
        with open(self.meta_path, 'w', encoding='utf-8') as f:
            json.dump([asdict(m) for m in self.metas], f, ensure_ascii=False)

    def _load(self) -> bool:
        if not (os.path.exists(self.index_path) and os.path.exists(self.meta_path)):
            return False
        self.index = faiss.read_index(self.index_path)
        with open(self.meta_path, 'r', encoding='utf-8') as f:
            raw = json.load(f)
        self.metas = [VectorMeta(**m) for m in raw]
        return True

    def build_from_retriever(self, retriever: LocalTextRetriever) -> int:
        # Build from scratch using retriever chunks
        texts = [c.text for c in retriever._chunks]
        if not texts:
            self.index = None
            self.metas = []
            if os.path.exists(self.index_path):
                os.remove(self.index_path)
            if os.path.exists(self.meta_path):
                os.remove(self.meta_path)
            return 0
        embs = embed_texts(texts)
        dim = embs.shape[1]
        index = faiss.IndexFlatIP(dim)  # cosine if normalized
        index.add(embs)
        self.index = index
        self.metas = [VectorMeta(text=c.text, source=c.source, chunk_id=c.chunk_id, category=c.category) for c in retriever._chunks]
        self._save()
        return len(self.metas)

    def search(self, query: str, k: int = 5, allowed_categories: Optional[List[str]] = None) -> List[Tuple[VectorMeta, float]]:
        if self.index is None:
            if not self._load():
                return []
        assert self.index is not None
        q_emb = embed_texts([query])
        sims, idxs = self.index.search(q_emb, k)
        results: List[Tuple[VectorMeta, float]] = []
        for score, idx in zip(sims[0], idxs[0]):
            if idx < 0 or idx >= len(self.metas):
                continue
            m = self.metas[idx]
            if allowed_categories and m.category.lower() not in {c.lower() for c in allowed_categories}:
                continue
            results.append((m, float(score)))
        return results

