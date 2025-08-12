from __future__ import annotations

from functools import lru_cache
from typing import List

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    # Hugging Face Inference Router via OpenAI-compatible API
    hf_token: str = Field(default="", alias="HF_TOKEN")
    hf_api_base: str = Field(default="https://router.huggingface.co/v1")
    model: str = Field(default="openai/gpt-oss-120b:novita")

    # Generation defaults
    temperature: float = 0.2
    top_p: float = 0.95
    max_tokens: int = 1024

    # DB
    database_url: str = Field(default="sqlite:///./app_data/irfan.sqlite3")

    # CORS
    cors_origins: List[str] = Field(default_factory=lambda: ["*"])


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()  # type: ignore[call-arg]
