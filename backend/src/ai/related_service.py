import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.conversations.model import Conversation
from src.messages.service import message_service
from src.notes.model import Note
from src.retrieval.service import retrieval_service


class RelatedService:

    async def find_related_content(
        self,
        db: AsyncSession,
        conversation_id: uuid.UUID,
    ) -> dict:

        # Get all messages in the conversation
        messages = await message_service.get_messages(
            db,
            conversation_id,
        )

        if not messages:
            return {
                "documents": [],
                "notes": [],
                "conversations": [],
            }

        # Get conversation
        conversation = await db.get(
            Conversation,
            conversation_id,
        )

        if not conversation:
            return {
                "documents": [],
                "notes": [],
                "conversations": [],
            }

        # Latest message becomes the semantic search query
        latest_message = messages[-1].content

        # Retrieve semantically similar chunks
        retrieved_chunks = (
            await retrieval_service.retrieve_chunks(
                db=db,
                project_id=conversation.project_id,
                question=latest_message,
            )
        )

        # Group retrieved chunks by document
        documents = []
        seen_documents = set()

        for item in retrieved_chunks:

            document = item["document"]

            if document.id in seen_documents:
                continue

            seen_documents.add(document.id)

            chunk = item["chunk"]

            documents.append(
                {
                    "id": str(document.id),
                    "title": document.title,
                    "project_id": str(document.project_id),
                    "snippet": (
                        chunk.content[:150] + "..."
                        if len(chunk.content) > 150
                        else chunk.content
                    ),
                    "similarity": item["similarity"],
                }
            )

        # Notes (still keyword based for now)
        note_result = await db.execute(
            select(Note)
            .where(
                Note.project_id == conversation.project_id,
            )
            .limit(5)
        )

        notes = note_result.scalars().all()

        # Other conversations (temporary implementation)
        conversation_result = await db.execute(
            select(Conversation)
            .where(
                Conversation.project_id == conversation.project_id,
                Conversation.id != conversation_id,
            )
            .limit(5)
        )

        conversations = conversation_result.scalars().all()

        return {
            "documents": documents,
            "notes": [
                {
                    "id": str(note.id),
                    "title": note.title,
                    "project_id": str(note.project_id),
                    "snippet": (
                        note.content[:150] + "..."
                        if len(note.content) > 150
                        else note.content
                    ),
                    "similarity": 80,
                }
                for note in notes
            ],
            "conversations": [
                {
                    "id": str(conv.id),
                    "title": conv.title,
                    "project_id": str(conv.project_id),
                    "snippet": "Related conversation",
                    "similarity": 75,
                }
                for conv in conversations
            ],
        }


related_service = RelatedService()