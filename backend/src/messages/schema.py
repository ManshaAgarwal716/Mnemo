import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from src.ai.schema import Source
from src.messages.enums import MessageRole
class MessageCreate(BaseModel):
    role: MessageRole
    sources: list[dict] | None = None
    content: str = Field(
        min_length=1,
    )


class MessageUpdate(BaseModel):
    content: str


class MessageResponse(BaseModel):
    id: uuid.UUID
    role: MessageRole
    content: str
    conversation_id: uuid.UUID
    created_at: datetime
    sources: list[Source] | None = None

    model_config = ConfigDict(
        from_attributes=True
    )