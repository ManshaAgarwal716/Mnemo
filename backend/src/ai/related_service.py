import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.conversations.model import Conversation
from src.documents.model import Document
from src.messages.service import message_service
from src.notes.model import Note


class RelatedService:

    async def find_related_content(
        self,
        db: AsyncSession,
        conversation_id: uuid.UUID,
    ) -> dict:

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

        document_result = await db.execute(
            select(Document)
            .where(
                Document.project_id == conversation.project_id,
            )
            .limit(5)
        )

        documents = document_result.scalars().all()

        note_result = await db.execute(
        select(Note)
        .where(
            Note.project_id == conversation.project_id,
        )
        .limit(5)
    )
        notes = note_result.scalars().all()

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
            "documents": [
                {
                    "id": str(document.id),
                    "title": document.title,
                    "project_id": str(document.project_id),
                    "snippet": f"{document.file_name} • {document.file_type}",
                    "similarity": 0.85,
                }
                for document in documents
            ],
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
                    "similarity": 0.80,
                }
                for note in notes
            ],
            "conversations": [
                {
                    "id": str(conv.id),
                    "title": conv.title,
                    "project_id": str(conv.project_id),
                    "snippet": "Related conversation",
                    "similarity": 0.75,
                }
                for conv in conversations
            ],
        }


related_service = RelatedService()