import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.messages.model import Message


class MessageRepository:

    async def create(
        self,
        db: AsyncSession,
        message: Message,
    ) -> Message:

        db.add(message)

        await db.commit()

        await db.refresh(message)

        return message

    async def get_all_by_conversation(
        self,
        db: AsyncSession,
        conversation_id: uuid.UUID,
    ) -> list[Message]:

        result = await db.execute(
            select(Message)
            .where(
                Message.conversation_id == conversation_id
            )
            .order_by(Message.created_at)
        )

        return result.scalars().all()

    async def get_by_id(
        self,
        db: AsyncSession,
        message_id: uuid.UUID,
    ) -> Message | None:

        result = await db.execute(
            select(Message).where(
                Message.id == message_id
            )
        )

        return result.scalar_one_or_none()

    async def update(
        self,
        db: AsyncSession,
        message: Message,
    ) -> Message:

        await db.commit()

        await db.refresh(message)

        return message

    async def delete(
        self,
        db: AsyncSession,
        message: Message,
    ) -> None:

        await db.delete(message)

        await db.commit()


message_repository = MessageRepository()