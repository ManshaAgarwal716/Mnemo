import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class NoteCreate(BaseModel):
    title: str = Field(
        min_length=1,
        max_length=255,
    )

    content: str = Field(
        min_length=1,
    )


class NoteUpdate(BaseModel):
    title: str | None = None
    content: str | None = None


class NoteResponse(BaseModel):
    id: uuid.UUID
    title: str
    content: str
    document_id: uuid.UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )