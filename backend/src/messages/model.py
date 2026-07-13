import uuid
from datetime import datetime
from typing import TYPE_CHECKING
from sqlalchemy import Enum

from src.messages.enums import MessageRole
from sqlalchemy import DateTime, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import JSON, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.db.base import Base

if TYPE_CHECKING:
    from src.conversations.model import Conversation


class Message(Base):
    __tablename__ = "messages"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    role: Mapped[MessageRole] = mapped_column(
    Enum(MessageRole),
    nullable=False,
)

    content: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    conversation_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("conversations.id"),
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
    )

    conversation: Mapped["Conversation"] = relationship(
        back_populates="messages",
    )
    sources: Mapped[list | None] = mapped_column(
    JSON,
    nullable=True,
    default=list,
)