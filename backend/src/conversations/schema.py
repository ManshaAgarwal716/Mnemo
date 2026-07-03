import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class ConversationCreate(BaseModel):
    title: str = Field(
        min_length=1,
        max_length=255,
    )


class ConversationUpdate(BaseModel):
    title: str | None = Field(
        default=None,
        min_length=1,
        max_length=255,
    )


class ConversationResponse(BaseModel):
    id: uuid.UUID
    title: str
    project_id: uuid.UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )