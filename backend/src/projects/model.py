import uuid
from datetime import datetime
from typing import TYPE_CHECKING
from src.conversations.model import Conversation
from sqlalchemy import DateTime, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from src.documents.model import Document
from src.db.base import Base
class Project(Base):
        __tablename__ = "projects"
        id:Mapped[uuid.UUID] = mapped_column(
            UUID(as_uuid=True),
            primary_key=True,
            default=uuid.uuid4,
        )
        name:Mapped[str] = mapped_column(
            String(100),
            nullable=False,
        )
        description:Mapped[str] = mapped_column(
            String(255),
            nullable=True,
        )
        color:Mapped[str] = mapped_column(
            String(10),
            nullable=True,
        )
        owner_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False,
    )

        created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
    )

        updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )

        owner: Mapped["User"] = relationship(
        back_populates="projects",
    )
        documents: Mapped[list["Document"]] = relationship(
    back_populates="project",
    cascade="all, delete-orphan",
)
        conversations: Mapped[list["Conversation"]] = relationship(
    back_populates="project",
    cascade="all, delete-orphan",
)

