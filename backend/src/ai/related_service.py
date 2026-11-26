import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.conversations.model import Conversation
from src.messages.service import message_service
from src.retrieval.service import retrieval_service


class RelatedService:

    async def find_related_content(
        self,
        db: AsyncSession,
        conversation_id: uuid.UUID,
        owner_id: uuid.UUID,
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
                owner_id=owner_id,
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

        note_results = await retrieval_service.retrieve_note_chunks(
            db, conversation.project_id, owner_id, latest_message
        )
        notes = []
        seen_notes = set()
        for item in note_results:
            note = item["note"]
            if note.id in seen_notes:
                continue
            seen_notes.add(note.id)
            notes.append({
                "id": str(note.id), "title": note.title,
                "project_id": str(note.project_id),
                "snippet": item["chunk"].content[:150],
                "similarity": item["similarity"],
            })

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
            "notes": notes,
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
