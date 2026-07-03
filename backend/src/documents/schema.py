import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class DocumentCreate(BaseModel):
    title: str = Field(
        min_length=1,
        max_length=255,
    )


class DocumentUpdate(BaseModel):
    title: str | None = Field(
        default=None,
        min_length=1,
        max_length=255,
    )


class DocumentResponse(BaseModel):
    id: uuid.UUID
    title: str
    file_name: str
    file_path: str
    file_type: str
    file_size: int
    project_id: uuid.UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )