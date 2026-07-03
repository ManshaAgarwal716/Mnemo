import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class ProjectCreate(BaseModel):
    name: str = Field(
        min_length=1,
        max_length=100,
    )

    description: str | None = Field(
        default=None,
        max_length=1000,
    )

    color: str = Field(
        default="#3B82F6",
    )


class ProjectUpdate(BaseModel):
    name: str | None = Field(
        default=None,
        min_length=1,
        max_length=100,
    )

    description: str | None = Field(
        default=None,
        max_length=1000,
    )

    color: str | None = None


class ProjectResponse(BaseModel):
    id: uuid.UUID
    name: str
    description: str | None
    color: str
    owner_id: uuid.UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )