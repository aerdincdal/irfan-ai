from __future__ import annotations

import os
from contextlib import contextmanager
from typing import Iterator

from sqlmodel import SQLModel, Session, create_engine
from sqlalchemy import event

from .config import get_settings


_engine = None


def init_engine_and_create_tables() -> None:
    global _engine
    settings = get_settings()

    # Ensure directory exists for SQLite file
    if settings.database_url.startswith("sqlite"):
        db_path = settings.database_url.split("///")[-1]
        os.makedirs(os.path.dirname(db_path), exist_ok=True)

    _engine = create_engine(settings.database_url, echo=False, connect_args={"check_same_thread": False} if settings.database_url.startswith("sqlite") else {})
    from . import models  # noqa: F401  # Ensure models are imported before create_all
    SQLModel.metadata.create_all(_engine)
    # SQLite performance/concurrency PRAGMAs
    if settings.database_url.startswith("sqlite"):
        @event.listens_for(_engine, "connect")
        def _set_sqlite_pragma(dbapi_connection, connection_record):
            try:
                cursor = dbapi_connection.cursor()
                cursor.execute("PRAGMA journal_mode=WAL;")
                cursor.execute("PRAGMA synchronous=NORMAL;")
                cursor.execute("PRAGMA temp_store=MEMORY;")
                cursor.execute("PRAGMA busy_timeout=5000;")
                cursor.close()
            except Exception:
                pass



@contextmanager

def get_session() -> Iterator[Session]:
    if _engine is None:
        init_engine_and_create_tables()
    assert _engine is not None
    with Session(_engine) as session:
        yield session
