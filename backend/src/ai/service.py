import uuid

from sqlalchemy.ext.asyncio import AsyncSession
from src.ai.providers.groq_provider import GroqProvider
from src.core.config import settings
from src.ai.providers.gemini_provider import GeminiProvider
from src.ai.schema import ChatResponse, Source
from src.conversations.schema import ConversationUpdate
from src.conversations.service import conversation_service
from src.messages.enums import MessageRole
from src.messages.schema import MessageCreate
from src.messages.service import message_service
from src.retrieval.service import retrieval_service

DEFAULT_TITLE = "New conversation"


class AIService:

    def __init__(self):
        if settings.LLM_PROVIDER.lower() == "groq":
            self.provider = GroqProvider()
        else:
            self.provider = GeminiProvider()

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
        owner_id: uuid.UUID,
        scope: str = "project",
        note_ids: list[uuid.UUID] | None = None,
        document_ids: list[uuid.UUID] | None = None,
        active_note_id: uuid.UUID | None = None,
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

        chunks = await retrieval_service.retrieve_context(
            db=db,
            project_id=conversation.project_id,
            owner_id=owner_id,
            question=prompt,
            scope=scope,
            note_ids=note_ids,
            document_ids=document_ids,
            active_note_id=active_note_id,
        )

        # Keep the evidence and citations aligned when the retrieved set is large.
        selected = []
        context_parts = []
        context_length = 0
        for item in chunks:
            resource = item["document"] if item["kind"] == "document" else item["note"]
            part = f"[{item['kind'].title()}: {resource.title}]\n{item['chunk'].content}"
            if context_length + len(part) > 48000:
                break
            selected.append(item)
            context_parts.append(part)
            context_length += len(part)
        context = "\n\n".join(context_parts)
        if len(selected) < len(chunks):
            context += "\n\n[Some matching content was omitted due to context length. Do not claim a complete summary.]"

        sources = []
        seen = set()

        for item in selected:
            resource = item["document"] if item["kind"] == "document" else item["note"]
            if (item["kind"], resource.id) in seen:
                continue

            seen.add((item["kind"], resource.id))

            sources.append(
                Source(
                    document_id=resource.id if item["kind"] == "document" else None,
                    note_id=resource.id if item["kind"] == "note" else None,
                    title=resource.title,
                    file_name=resource.file_name if item["kind"] == "document" else None,
                    source_type=item["kind"],
                    excerpt=item["chunk"].content[:220],
                )
            )

        history = [
            {"role": "user" if message.role == MessageRole.USER else "model",
             "parts": [{"text": message.content}]}
            for message in messages
        ]

        await self.save_user_message(db, conversation_id, prompt)

        casual = prompt.casefold().strip().rstrip("!?.") in {"hi", "hello", "hey", "thanks", "thank you"}
        if not selected and not casual:
            response = "I couldn't find enough relevant information in your saved notes or documents to answer that. Try naming a note or project, or add more detail to the source."
        else:
            response = await self.provider.generate(history, prompt, context)

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
                new_title = await self.provider.generate_title(
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
                print(f"Title generation failed: {e}")

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
