"""Data models for the collector pipeline."""

from datetime import datetime

from pydantic import BaseModel, Field


class FeedItem(BaseModel):
    """Raw item fetched from a feed source."""

    title: str
    url: str
    summary: str = ""
    source: str
    channel: str = "rss"
    language: str = "en"
    published_at: datetime | None = None
    collected_at: datetime = Field(default_factory=datetime.utcnow)


class ScoredItem(BaseModel):
    """Item after AI scoring, ready for inbox output."""

    id: str  # "src_YYYYMMDD_NNN"
    title: str
    title_zh: str = ""
    source: str
    channel: str
    url: str
    summary: str = ""
    tags: list[str] = Field(default_factory=list)
    suggested_category: str = "signals"
    score: float = 0.0
    score_detail: dict = Field(default_factory=dict)
    score_reason: str = ""
    collected_at: str = ""  # ISO 8601
