import uuid

from pydantic import BaseModel, Field

class Source(BaseModel):
    document_id: uuid.UUID
    title: str
    file_name: str
class ChatRequest(BaseModel):
    conversation_id: uuid.UUID
    message: str = Field(
        min_length=1,
    )


class ChatResponse(BaseModel):
    response: str
    conversation_id: uuid.UUID
    sources: list[Source]