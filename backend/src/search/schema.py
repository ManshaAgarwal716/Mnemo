from datetime import datetime
from typing import Literal

from pydantic import BaseModel


class SearchRequest(BaseModel):
    query: str

    filter: Literal[
        "all",
        "project",
        "document",
        "note",
        "conversation",
    ] = "all"


class SearchResult(BaseModel):
    id: str
    type: Literal[
        "project",
        "document",
        "note",
        "conversation",
    ]

    title: str
    snippet: str

    project_id: str | None = None

    score: float = 100

    tags: list[str] = []

    created_at: datetime


class SearchResponse(BaseModel):
    ai_answer: str = ""
    results: list[SearchResult]