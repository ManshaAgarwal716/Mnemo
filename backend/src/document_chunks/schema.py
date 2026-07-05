import uuid

from pydantic import BaseModel, ConfigDict


class DocumentChunkCreate(BaseModel):

    chunk_index: int

    content: str


class DocumentChunkResponse(BaseModel):

    id: uuid.UUID

    document_id: uuid.UUID

    chunk_index: int

    content: str

    model_config = ConfigDict(
        from_attributes=True,
    )