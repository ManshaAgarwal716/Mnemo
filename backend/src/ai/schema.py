import uuid
from typing import Literal

from pydantic import BaseModel, Field

class Source(BaseModel):
    document_id: uuid.UUID | None = None
    note_id: uuid.UUID | None = None
    title: str
    file_name: str | None = None
    source_type: Literal["note", "document"] | None = None
    excerpt: str | None = None
class ChatRequest(BaseModel):
    conversation_id: uuid.UUID
    message: str = Field(
        min_length=1,
    )
    scope: Literal["project", "all"] = "project"
    note_ids: list[uuid.UUID] = Field(default_factory=list, max_length=20)
    document_ids: list[uuid.UUID] = Field(default_factory=list, max_length=20)
    active_note_id: uuid.UUID | None = None


class ChatResponse(BaseModel):
    response: str
    conversation_id: uuid.UUID
    sources: list[Source]
