
from __future__ import annotations

import uuid
from typing import Any, List

from fastapi import APIRouter, HTTPException

from ..db import get_session
from ..models import ChatSession, Message
from ..schemas import MessageResponse, SessionCreate, SessionResponse

router = APIRouter(prefix="/sessions", tags=["sessions"])


@router.post("", response_model=SessionResponse)
def create_session(body: SessionCreate) -> Any:
    new_id = str(uuid.uuid4())
    with get_session() as db:
        session = ChatSession(id=new_id, title=body.title, user_id=body.user_id)
        db.add(session)
        db.commit()
        db.refresh(session)
        return SessionResponse(id=session.id, user_id=session.user_id, title=session.title, created_at=session.created_at, updated_at=session.updated_at)


@router.get("", response_model=List[SessionResponse])
def list_sessions(user_id: str | None = None) -> Any:
    """List sessions, optionally filtered by user_id. Returns max 30 most recent."""
    with get_session() as db:
        query = db.query(ChatSession)
        if user_id:
            query = query.filter(ChatSession.user_id == user_id)
        rows = query.order_by(ChatSession.updated_at.desc()).limit(30).all()
        return [SessionResponse(id=r.id, user_id=r.user_id, title=r.title, created_at=r.created_at, updated_at=r.updated_at) for r in rows]


@router.get("/{session_id}", response_model=SessionResponse)
def get_session_info(session_id: str) -> Any:
    with get_session() as db:
        sess = db.get(ChatSession, session_id)
        if not sess:
            raise HTTPException(status_code=404, detail="Oturum bulunamadı")
        return SessionResponse(id=sess.id, user_id=sess.user_id, title=sess.title, created_at=sess.created_at, updated_at=sess.updated_at)


@router.get("/{session_id}/messages", response_model=List[MessageResponse])
def get_messages(session_id: str) -> Any:
    with get_session() as db:
        sess = db.get(ChatSession, session_id)
        if not sess:
            raise HTTPException(status_code=404, detail="Oturum bulunamadı")
        rows = db.query(Message).filter(Message.session_id == session_id).order_by(Message.created_at.asc()).all()
        return [MessageResponse(id=r.id or 0, role=r.role, content=r.content, created_at=r.created_at) for r in rows]


@router.delete("/{session_id}")
def delete_session(session_id: str) -> Any:
    with get_session() as db:
        sess = db.get(ChatSession, session_id)
        if not sess:
            raise HTTPException(status_code=404, detail="Oturum bulunamadı")
        db.query(Message).filter(Message.session_id == session_id).delete()
        db.delete(sess)
        db.commit()
        return {"ok": True}


@router.post("/{session_id}/reset")
def reset_session(session_id: str) -> Any:
    with get_session() as db:
        sess = db.get(ChatSession, session_id)
        if not sess:
            raise HTTPException(status_code=404, detail="Oturum bulunamadı")
        db.query(Message).filter(Message.session_id == session_id).delete()
        db.commit()
        return {"ok": True}
