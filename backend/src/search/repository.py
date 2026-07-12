from sqlalchemy import or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from src.projects.model import Project
from src.documents.model import Document
from src.notes.model import Note


class SearchRepository:

    async def search_projects(
        self,
        db: AsyncSession,
        query: str,
    ):

        statement = (
            select(Project)
            .where(
                Project.title.ilike(f"%{query}%")
            )
        )

        result = await db.execute(statement)

        return result.scalars().all()


    async def search_documents(
        self,
        db: AsyncSession,
        query: str,
    ):

        statement = (
            select(Document)
            .where(
                Document.title.ilike(f"%{query}%")
            )
        )

        result = await db.execute(statement)

        return result.scalars().all()


    async def search_notes(
        self,
        db: AsyncSession,
        query: str,
    ):

        statement = (
            select(Note)
            .where(
                or_(
                    Note.title.ilike(f"%{query}%"),
                    Note.content.ilike(f"%{query}%"),
                )
            )
        )

        result = await db.execute(statement)

        return result.scalars().all()



search_repository = SearchRepository()