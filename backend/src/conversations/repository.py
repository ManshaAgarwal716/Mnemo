import uuid

from sqlalchemy.ext.asyncio import AsyncSession

from src.conversations.model import Conversation

from sqlalchemy import select, delete
from src.messages.model import Message
class ConversationRepository:

    async def create(
        self,
        db: AsyncSession,
        conversation: Conversation,
    ) -> Conversation:

        db.add(conversation)

        await db.commit()

        await db.refresh(conversation)

        return conversation

    async def get_all_by_project(
        self,
        db: AsyncSession,
        project_id: uuid.UUID,
    ) -> list[Conversation]:

        result = await db.execute(
            select(Conversation).where(
                Conversation.project_id == project_id
            )
        )

        return result.scalars().all()

    async def get_by_id(
        self,
        db: AsyncSession,
        conversation_id: uuid.UUID,
    ) -> Conversation | None:

        result = await db.execute(
            select(Conversation).where(
                Conversation.id == conversation_id
            )
        )

        return result.scalar_one_or_none()

    async def update(
        self,
        db: AsyncSession,
        conversation: Conversation,
    ) -> Conversation:

        await db.commit()

        await db.refresh(conversation)

        return conversation

    async def delete(
        self,
        db: AsyncSession,
        conversation: Conversation,
    ) -> None:

        await db.delete(conversation)

        await db.commit()
    async def clear_messages(
    self,
    db: AsyncSession,
    conversation_id: uuid.UUID,
) -> None:

        await db.execute(
            delete(Message).where(
                Message.conversation_id == conversation_id
            )
        )

        await db.commit()
    


conversation_repository = ConversationRepository()