from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from src.document_chunks.model import DocumentChunk
from src.documents.model import Document
from src.projects.model import Project
from src.notes.model import Note
from src.notes.chunk import NoteChunk


class RetrievalRepository:

    async def semantic_note_search(
        self, db: AsyncSession, project_id: UUID | None, owner_id: UUID,
        query_embedding: list[float], limit: int = 12,
        note_ids: list[UUID] | None = None,
    ):
        distance = NoteChunk.embedding.cosine_distance(query_embedding).label("distance")
        statement = (
            select(NoteChunk, Note, distance)
            .join(Note, NoteChunk.note_id == Note.id)
            .join(Project, Note.project_id == Project.id)
            .where(Project.owner_id == owner_id)
            .order_by(distance)
            .limit(limit)
        )
        if project_id is not None:
            statement = statement.where(Note.project_id == project_id)
        if note_ids is not None:
            statement = statement.where(Note.id.in_(note_ids))
        return (await db.execute(statement)).all()

    async def list_note_chunks(
        self, db: AsyncSession, project_id: UUID | None, owner_id: UUID,
        note_ids: list[UUID] | None = None, limit: int = 60,
    ):
        statement = (
            select(NoteChunk, Note)
            .join(Note, NoteChunk.note_id == Note.id)
            .join(Project, Note.project_id == Project.id)
            .where(Project.owner_id == owner_id)
            .order_by(Note.updated_at.desc(), NoteChunk.chunk_index)
            .limit(limit)
        )
        if project_id is not None:
            statement = statement.where(Note.project_id == project_id)
        if note_ids is not None:
            statement = statement.where(Note.id.in_(note_ids))
        return (await db.execute(statement)).all()

    async def list_accessible_notes(
        self, db: AsyncSession, project_id: UUID | None, owner_id: UUID,
    ):
        statement = select(Note).join(Project, Note.project_id == Project.id).where(Project.owner_id == owner_id)
        if project_id is not None:
            statement = statement.where(Note.project_id == project_id)
        return (await db.scalars(statement)).all()

    async def semantic_search(
        self,
        db: AsyncSession,
        project_id: UUID | None,
        owner_id: UUID,
        query_embedding: list[float],
        limit: int = 12,
        document_ids: list[UUID] | None = None,
    ):


        distance = DocumentChunk.embedding.cosine_distance(
            query_embedding
        ).label("distance")

        statement = (
            select(
                DocumentChunk,
                Document,
                distance,
            )
            .join(Document)
            .join(Project, Document.project_id == Project.id)
            .where(
                Project.owner_id == owner_id,
            )
            .order_by(distance)
            .limit(limit)
        )
        if project_id is not None:
            statement = statement.where(Document.project_id == project_id)
        if document_ids is not None:
            statement = statement.where(Document.id.in_(document_ids))
        

        result = await db.execute(statement)

        return result.all()


retrieval_repository = RetrievalRepository()
