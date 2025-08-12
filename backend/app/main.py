
from __future__ import annotations

import os
from datetime import datetime
from typing import Any

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from .config import get_settings
from .db import init_engine_and_create_tables
from .retrieval.retriever import build_global_retriever
from .rag.vector_store import FaissVectorStore
from .ingest.auto_ingest import auto_ingest_new_uploads
from .routers.chat import router as chat_router
from .routers.sessions import router as sessions_router
from .routers.ingest import router as ingest_router


load_dotenv()

app = FastAPI(title="Irfan Chat API", version="1.0.0")

settings = get_settings()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup() -> None:
    init_engine_and_create_tables()
    # Build retriever at startup so we avoid cold-start delay on first request
    data_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data"))
    build_global_retriever(data_dir=data_dir)
    # Auto-ingest PDFs from uploads and rebuild indexes
    auto_ingest_new_uploads()
    # Build FAISS vector index
    from .retrieval.retriever import get_retriever
    vs = FaissVectorStore(index_dir=os.path.join(os.path.dirname(__file__), "..", "app_data", "faiss"))
    vs.build_from_retriever(get_retriever())


@app.get("/api/health")
def healthcheck() -> dict[str, Any]:
    return {
        "status": "ok",
        "time": datetime.utcnow().isoformat() + "Z",
        "model": settings.model,
        "hf_api_base": settings.hf_api_base,
    }


# Routers
app.include_router(sessions_router, prefix="/api")
app.include_router(chat_router, prefix="/api/irfan")
app.include_router(ingest_router, prefix="/api")
