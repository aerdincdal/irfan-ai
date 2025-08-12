from __future__ import annotations

from datetime import datetime
from typing import List, Literal, Optional

from pydantic import BaseModel, Field


class SessionCreate(BaseModel):
    title: Optional[str] = None


class SessionResponse(BaseModel):
    id: str
    title: Optional[str] = None
    created_at: datetime
    updated_at: datetime


class MessageResponse(BaseModel):
    id: int
    role: str
    content: str
    created_at: datetime


class ChatRequest(BaseModel):
    query: str
    session_id: Optional[str] = None
    stream: bool = False
    language: Literal["both", "tr", "ar", "auto"] = "both"
    temperature: float = 0.2
    top_p: float = 0.95
    max_tokens: int = 800


class ChatChunk(BaseModel):
    # For SSE streaming
    token: str
    done: bool = False


class ChatResponse(BaseModel):
    session_id: str
    content: str
    citations: List[str] = Field(default_factory=list)
    language: Literal["both", "tr", "ar", "auto"] = "both"
