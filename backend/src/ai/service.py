import uuid

from google import genai
from sqlalchemy.ext.asyncio import AsyncSession

from src.ai.schema import ChatResponse, Source
from src.core.config import settings
from src.retrieval.service import retrieval_service
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
                            "text": message.content,
                        }
                    ],
                }
            )

        return history

    async def generate(
        self,
        history,
        prompt: str,
        context: str,
    ) -> str:

        history.append(
            {
                "role": "user",
                "parts": [
                    {
                        "text": f"""
You are Mnemo AI, an AI research assistant.

Answer using the provided context whenever possible.

If the user greets you (hello, hi, hey) or asks a casual question,
respond naturally.

If the answer cannot be found in the context, politely say that you
couldn't find relevant information in the uploaded documents rather than
making up facts.

Context:
{context}

Question:
{prompt}
""",
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
        sources: list[dict],
    ):
        await message_service.create_message(
            db=db,
            conversation_id=conversation_id,
            message_data=MessageCreate(
                role=MessageRole.ASSISTANT,
                content=response,
                sources=sources,
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

        conversation = await conversation_service.get_conversation(
            db,
            conversation_id,
        )

        chunks = await retrieval_service.retrieve_chunks(
            db=db,
            project_id=conversation.project_id,
            question=prompt,
        )


        context = "\n".join(
            chunk.content
            for chunk, _ in chunks
        )

        sources = []
        seen = set()

        for _, document in chunks:
            if document.id in seen:
                continue

            seen.add(document.id)

            sources.append(
                Source(
                    document_id=document.id,
                    title=document.title,
                    file_name=document.file_name,
                )
            )

        history = await self.build_history(
            db,
            conversation_id,
        )

        response = await self.generate(
            history,
            prompt,
            context,
        )

        await self.save_ai_message(
            db,
            conversation_id,
            response,
           [source.model_dump(mode="json") for source in sources]
        )

        return ChatResponse(
            conversation_id=conversation_id,
            response=response,
            sources=sources,
        )


ai_service = AIService()