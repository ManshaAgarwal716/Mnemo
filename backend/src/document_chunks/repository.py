from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from src.document_chunks.model import DocumentChunk
from src.document_chunks.schema import DocumentChunkCreate


class DocumentChunkRepository:

    async def create_chunk(
        self,
        db: AsyncSession,
        document_id,
        chunk_data: DocumentChunkCreate,
    ) -> DocumentChunk:

        chunk = DocumentChunk(
            document_id=document_id,
            chunk_index=chunk_data.chunk_index,
            content=chunk_data.content,
        )

        db.add(chunk)

        await db.commit()

        await db.refresh(chunk)

        return chunk


    async def get_document_chunks(
        self,
        db: AsyncSession,
        document_id,
    ) -> list[DocumentChunk]:

        statement = (
            select(DocumentChunk)
            .where(
                DocumentChunk.document_id == document_id
            )
            .order_by(
                DocumentChunk.chunk_index
            )
        )

        result = await db.execute(statement)

        return result.scalars().all()


    async def delete_document_chunks(
        self,
        db: AsyncSession,
        document_id,
    ):

        statement = (
            delete(DocumentChunk)
            .where(
                DocumentChunk.document_id == document_id
            )
        )

        await db.execute(statement)

        await db.commit()


document_chunk_repository = DocumentChunkRepository()