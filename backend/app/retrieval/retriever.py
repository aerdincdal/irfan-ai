
from __future__ import annotations

import os
from dataclasses import dataclass
from typing import List, Tuple, Optional

from rank_bm25 import BM25Okapi


@dataclass
class DocumentChunk:
    text: str
    source: str
    chunk_id: str
    category: str


class LocalTextRetriever:
    def __init__(self, data_root: str) -> None:
        self._data_root: str = os.path.abspath(data_root)
        self._chunks: List[DocumentChunk] = []
        self._bm25: Optional[BM25Okapi] = None
        self._tokenized_corpus: List[List[str]] = []

    @staticmethod
    def _tokenize(text: str) -> List[str]:
        return [t.strip().lower() for t in text.replace('\n', ' ').split() if t.strip()]

    @staticmethod
    def _split_into_paragraphs(text: str) -> List[str]:
        parts = [p.strip() for p in text.split('\n\n')]
        return [p for p in parts if p]

    def _infer_category(self, file_path: str) -> str:
        try:
            rel = os.path.relpath(os.path.dirname(file_path), self._data_root)
        except ValueError:
            return 'root'
        if rel == '.' or rel.startswith('..'):
            return 'root'
        top = rel.split(os.sep)[0]
        return top or 'root'

    def load_directory(self, directory: str) -> int:
        directory = os.path.abspath(directory)
        count = 0
        if not os.path.exists(directory):
            return 0
        for root, _dirs, files in os.walk(directory):
            for fname in files:
                if not fname.lower().endswith(('.txt', '.md')):
                    continue
                fpath = os.path.join(root, fname)
                category = self._infer_category(fpath)
                with open(fpath, 'r', encoding='utf-8', errors='ignore') as f:
                    raw = f.read()
                paragraphs = self._split_into_paragraphs(raw)
                for idx, para in enumerate(paragraphs):
                    chunk_id = f"{fname}-{idx}"
                    self._chunks.append(DocumentChunk(text=para, source=fpath, chunk_id=chunk_id, category=category))
                    count += 1
        self._tokenized_corpus = [self._tokenize(c.text) for c in self._chunks]
        if self._tokenized_corpus:
            self._bm25 = BM25Okapi(self._tokenized_corpus)
        return count

    def retrieve(self, query: str, k: int = 5, allowed_categories: Optional[List[str]] = None) -> List[Tuple[DocumentChunk, float]]:
        if self._bm25 is None or not self._tokenized_corpus:
            return []
        q_tokens = self._tokenize(query)
        scores = self._bm25.get_scores(q_tokens)
        idx_scores = list(enumerate(scores))
        # Optional category filtering
        if allowed_categories:
            allowed_set = set(a.lower() for a in allowed_categories)
            idx_scores = [(i, s) for i, s in idx_scores if self._chunks[i].category.lower() in allowed_set]
            if not idx_scores:
                # fallback to global if none matched
                idx_scores = list(enumerate(scores))
        idx_scores.sort(key=lambda x: x[1], reverse=True)
        idx_scores = idx_scores[:k]
        return [(self._chunks[i], float(s)) for i, s in idx_scores if s > 0]


# Global singleton retriever stored on module for simplicity
_GLOBAL: Optional[LocalTextRetriever] = None


def build_global_retriever(data_dir: str | None = None) -> LocalTextRetriever:
    global _GLOBAL
    if data_dir is None:
        data_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'data'))
    os.makedirs(data_dir, exist_ok=True)
    retriever = LocalTextRetriever(data_root=data_dir)
    retriever.load_directory(data_dir)
    _GLOBAL = retriever
    return retriever


def get_retriever() -> LocalTextRetriever:
    if _GLOBAL is None:
        return build_global_retriever()
    return _GLOBAL
