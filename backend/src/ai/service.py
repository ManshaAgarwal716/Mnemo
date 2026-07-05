import uuid

from google import genai
from sqlalchemy.ext.asyncio import AsyncSession

from src.ai.schema import ChatResponse
from src.core.config import settings

from src.messages.enums import MessageRole
from src.messages.schema import MessageCreate
from src.messages.service import message_service

from src.conversations.service import conversation_service
class AIService:

    def __init__(self):

        self.client = genai.Client(
            api_key=settings.GEMINI_API_KEY,
        )
    async def build_history(
        self,
        db: AsyncSession,
        conversation_id: uuid.UUID,
    ):

        messages = await message_service.get_messages(
            db,
            conversation_id,
        )

        history = []

        for message in messages:

            role = (
                "user"
                if message.role == MessageRole.USER
                else "model"
            )

            history.append(
                {
                    "role": role,
                    "parts": [
                        {
                            "text": message.content
                        }
                    ],
                }
            )
        return history
    async def generate(
        self,
        history,
        prompt: str,
    ) -> str:

        history.append(
            {
                "role": "user",
                "parts": [
                    {
                        "text": prompt,
                    }
                ],
            }
        )
        response = self.client.models.generate_content(
            model="gemini-2.5-flash",
            contents=history,
        )

        return response.text
    async def save_user_message(
        self,
        db: AsyncSession,
        conversation_id: uuid.UUID,
        prompt: str,
    ):

        await message_service.create_message(
            db=db,
            conversation_id=conversation_id,
            message_data=MessageCreate(
                role=MessageRole.USER,
                content=prompt,
            ),
        )
    async def save_ai_message(
        self,
        db: AsyncSession,
        conversation_id: uuid.UUID,
        response: str,
    ):

        await message_service.create_message(
            db=db,
            conversation_id=conversation_id,
            message_data=MessageCreate(
                role=MessageRole.ASSISTANT,
                content=response,
            ),
        )
    async def chat(
    self,
    db: AsyncSession,
    conversation_id: uuid.UUID,
    prompt: str,
) -> ChatResponse:
        await conversation_service.get_conversation(
            db,
            conversation_id,
        )
        await self.save_user_message(
            db,
            conversation_id,
            prompt,
        )
        history = await self.build_history(
            db,
            conversation_id,
        )
        response = await self.generate(
            history,
            prompt,
        )
        await self.save_ai_message(
            db,
            conversation_id,
            response,
        )
        return ChatResponse(
            conversation_id=conversation_id,
            response=response,
        )
ai_service = AIService()