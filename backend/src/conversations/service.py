import uuid

from sqlalchemy.ext.asyncio import AsyncSession

from src.conversations.model import Conversation
from src.conversations.repository import conversation_repository
from src.conversations.schema import (
    ConversationCreate,
    ConversationUpdate,
)


class ConversationService:

    async def create_conversation(
        self,
        db: AsyncSession,
        project_id: uuid.UUID,
        conversation_data: ConversationCreate,
    ) -> Conversation:

        conversation = Conversation(
            title=conversation_data.title,
            project_id=project_id,
        )

        return await conversation_repository.create(
            db,
            conversation,
        )

    async def get_conversations(
        self,
        db: AsyncSession,
        project_id: uuid.UUID,
    ):

        return await conversation_repository.get_all_by_project(
            db,
            project_id,
        )

    async def get_conversation(
        self,
        db: AsyncSession,
        conversation_id: uuid.UUID,
    ) -> Conversation:

        conversation = await conversation_repository.get_by_id(
            db,
            conversation_id,
        )

        if not conversation:
            raise ValueError("Conversation not found.")

        return conversation

    async def update_conversation(
        self,
        db: AsyncSession,
        conversation_id: uuid.UUID,
        conversation_data: ConversationUpdate,
    ) -> Conversation:

        conversation = await self.get_conversation(
            db,
            conversation_id,
        )

        update_data = conversation_data.model_dump(
            exclude_unset=True
        )

        for key, value in update_data.items():
            setattr(
                conversation,
                key,
                value,
            )

        return await conversation_repository.update(
            db,
            conversation,
        )

    async def delete_conversation(
        self,
        db: AsyncSession,
        conversation_id: uuid.UUID,
    ) -> None:

        conversation = await self.get_conversation(
            db,
            conversation_id,
        )

        await conversation_repository.delete(
            db,
            conversation,
        )


conversation_service = ConversationService()