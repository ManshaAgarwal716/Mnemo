import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.documents.model import Document


class DocumentRepository:

    async def create(
        self,
        db: AsyncSession,
        document: Document,
    ) -> Document:

        db.add(document)

        await db.commit()

        await db.refresh(document)

        return document

    async def get_all_by_project(
        self,
        db: AsyncSession,
        project_id: uuid.UUID,
    ) -> list[Document]:

        result = await db.execute(
            select(Document).where(
                Document.project_id == project_id
            )
        )

        return result.scalars().all()

    async def get_by_id(
        self,
        db: AsyncSession,
        document_id: uuid.UUID,
    ) -> Document | None:

        result = await db.execute(
            select(Document).where(
                Document.id == document_id
            )
        )

        return result.scalar_one_or_none()

    async def update(
        self,
        db: AsyncSession,
        document: Document,
    ) -> Document:

        await db.commit()

        await db.refresh(document)

        return document

    async def delete(
        self,
        db: AsyncSession,
        document: Document,
    ) -> None:

        await db.delete(document)

        await db.commit()


document_repository = DocumentRepository()