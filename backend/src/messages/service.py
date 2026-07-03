import uuid

from sqlalchemy.ext.asyncio import AsyncSession

from src.messages.model import Message
from src.messages.repository import message_repository
from src.messages.schema import (
    MessageCreate,
    MessageUpdate,
)


class MessageService:

    async def create_message(
        self,
        db: AsyncSession,
        conversation_id: uuid.UUID,
        message_data: MessageCreate,
    ) -> Message:

        message = Message(
            role=message_data.role,
            content=message_data.content,
            conversation_id=conversation_id,
        )

        return await message_repository.create(
            db,
            message,
        )

    async def get_messages(
        self,
        db: AsyncSession,
        conversation_id: uuid.UUID,
    ):

        return await message_repository.get_all_by_conversation(
            db,
            conversation_id,
        )

    async def get_message(
        self,
        db: AsyncSession,
        message_id: uuid.UUID,
    ) -> Message:

        message = await message_repository.get_by_id(
            db,
            message_id,
        )

        if not message:
            raise ValueError("Message not found.")

        return message

    async def update_message(
        self,
        db: AsyncSession,
        message_id: uuid.UUID,
        message_data: MessageUpdate,
    ) -> Message:

        message = await self.get_message(
            db,
            message_id,
        )

        update_data = message_data.model_dump(
            exclude_unset=True
        )

        for key, value in update_data.items():
            setattr(
                message,
                key,
                value,
            )

        return await message_repository.update(
            db,
            message,
        )

    async def delete_message(
        self,
        db: AsyncSession,
        message_id: uuid.UUID,
    ) -> None:

        message = await self.get_message(
            db,
            message_id,
        )

        await message_repository.delete(
            db,
            message,
        )


message_service = MessageService()