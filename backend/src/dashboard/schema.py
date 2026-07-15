from datetime import datetime
from typing import Literal

from pydantic import BaseModel


class DashboardStats(BaseModel):
    projects: int
    documents: int
    notes: int
    conversations: int


class ActivityItem(BaseModel):
    id: str
    type: Literal[
        "project",
        "document",
        "note",
        "conversation",
    ]

    name: str
    subtitle: str
    timestamp: datetime

    project_id: str | None = None
    document_id: str | None = None
    conversation_id: str | None = None


class DashboardResponse(BaseModel):
    stats: DashboardStats
    recent_activity: list[ActivityItem]