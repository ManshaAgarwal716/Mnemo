import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from src.messages.enums import MessageRole
class MessageCreate(BaseModel):
    role: MessageRole

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

    model_config = ConfigDict(
        from_attributes=True
    )