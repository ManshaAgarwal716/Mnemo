import uuid

from pydantic import BaseModel, ConfigDict


class DocumentChunkCreate(BaseModel):

    chunk_index: int
    content: str
    embedding: list[float] | None = None


class DocumentChunkResponse(BaseModel):

    id: uuid.UUID

    document_id: uuid.UUID
    chunk_index: int
    content: str
    embedding: list[float] | None = None
    model_config = ConfigDict(
        from_attributes=True,
    )