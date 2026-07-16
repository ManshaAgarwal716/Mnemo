import uuid

from google import genai
from sqlalchemy.ext.asyncio import AsyncSession

from src.ai.schema import ChatResponse, Source
from src.conversations.schema import ConversationUpdate
from src.conversations.service import conversation_service
from src.core.config import settings
from src.messages.enums import MessageRole
from src.messages.schema import MessageCreate
from src.messages.service import message_service
from src.retrieval.service import retrieval_service
import traceback

DEFAULT_TITLE = "New conversation"


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
            history.append(
                {
                    "role": (
                        "user"
                        if message.role == MessageRole.USER
                        else "model"
                    ),
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

If the user greets you or asks casual questions,
respond naturally.

If the answer cannot be found inside the provided
context, clearly say you couldn't find relevant
information in the uploaded documents.

Context:
{context}

Question:
{prompt}
"""
                    }
                ],
            }
        )

        response = self.client.models.generate_content(
            model="gemini-2.5-flash",
            contents=history,
        )

        return response.text

    async def generate_title(
        self,
        first_message: str,
    ) -> str:

        prompt = f"""
Generate a concise conversation title.

Rules:
- 3 to 6 words.
- No punctuation.
- No quotation marks.
- Return ONLY the title.

User message:

{first_message}
"""

        response = self.client.models.generate_content(
            model="gemini-2.5-flash",
            contents=[
                {
                    "role": "user",
                    "parts": [
                        {
                            "text": prompt,
                        }
                    ],
                }
            ],
        )

        title = (
            response.text
            .strip()
            .strip('"')
            .strip("'")
        )

        return title[:100]

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

        conversation = await conversation_service.get_conversation(
            db,
            conversation_id,
        )

        messages = await message_service.get_messages(
            db,
            conversation_id,
        )

        is_first_message = len(messages) == 0

        await self.save_user_message(
            db,
            conversation_id,
            prompt,
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
            [
                source.model_dump(mode="json")
                for source in sources
            ],
        )

        if (
            is_first_message
            and conversation.title == DEFAULT_TITLE
        ):
            try:
                new_title = await self.generate_title(
                    prompt,
                )

                await conversation_service.update_conversation(
                    db,
                    conversation_id,
                    ConversationUpdate(
                        title=new_title,
                    ),
                )

            except Exception as e:
                print(
                    f"Title generation failed: {e}"
                )

                try:
                    await conversation_service.update_conversation(
                        db,
                        conversation_id,
                        ConversationUpdate(
                            title=prompt[:50],
                        ),
                    )
                except Exception:
                    pass

        return ChatResponse(
            conversation_id=conversation_id,
            response=response,
            sources=sources,
        )


ai_service = AIService()