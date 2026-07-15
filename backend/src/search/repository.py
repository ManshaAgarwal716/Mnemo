from sqlalchemy import or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from src.projects.model import Project
from src.documents.model import Document
from src.notes.model import Note
from src.conversations.model import Conversation


class SearchRepository:

    async def search_projects(
        self,
        db: AsyncSession,
        owner_id,
        query: str,
    ):
        result = await db.execute(
            select(Project)
            .where(
                Project.owner_id == owner_id,
                or_(
                    Project.name.ilike(f"%{query}%"),
                    Project.description.ilike(f"%{query}%"),
                ),
            )
        )

        projects = result.scalars().all()

        return [
            {
                "id": str(project.id),
                "type": "project",
                "title": project.name,
                "snippet": project.description or "Research project",
                "project_id": str(project.id),
                "score": 100,
                "tags": ["Project"],
                "created_at": project.updated_at,
            }
            for project in projects
        ]

    async def search_documents(
        self,
        db: AsyncSession,
        owner_id,
        query: str,
    ):
        result = await db.execute(
            select(Document)
            .join(Project)
            .where(
                Project.owner_id == owner_id,
                or_(
                    Document.title.ilike(f"%{query}%"),
                    Document.file_name.ilike(f"%{query}%"),
                ),
            )
        )

        documents = result.scalars().all()

        return [
            {
                "id": str(document.id),
                "type": "document",
                "title": document.title,
                "snippet": document.file_name,
                "project_id": str(document.project_id),
                "score": 95,
                "tags": ["PDF"],
                "created_at": document.updated_at,
            }
            for document in documents
        ]

    async def search_notes(
        self,
        db: AsyncSession,
        owner_id,
        query: str,
    ):
        result = await db.execute(
            select(Note)
            .join(Project)
            .where(
                Project.owner_id == owner_id,
                or_(
                    Note.title.ilike(f"%{query}%"),
                    Note.content.ilike(f"%{query}%"),
                ),
            )
        )

        notes = result.scalars().all()

        return [
            {
                "id": str(note.id),
                "type": "note",
                "title": note.title,
                "snippet": (
                    note.content[:180] + "..."
                    if len(note.content) > 180
                    else note.content
                ),
                "project_id": str(note.project_id),
                "score": 90,
                "tags": ["Note"],
                "created_at": note.updated_at,
            }
            for note in notes
        ]

    async def search_conversations(
        self,
        db: AsyncSession,
        owner_id,
        query: str,
    ):
        result = await db.execute(
            select(Conversation)
            .join(Project)
            .where(
                Project.owner_id == owner_id,
                Conversation.title.ilike(f"%{query}%"),
            )
        )

        conversations = result.scalars().all()

        return [
            {
                "id": str(conversation.id),
                "type": "conversation",
                "title": conversation.title,
                "snippet": "AI Conversation",
                "project_id": str(conversation.project_id),
                "score": 85,
                "tags": ["AI"],
                "created_at": conversation.updated_at,
            }
            for conversation in conversations
        ]


search_repository = SearchRepository()