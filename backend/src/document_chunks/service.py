from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from src.document_chunks.repository import (
    document_chunk_repository,
)
from src.document_chunks.schema import (
    DocumentChunkCreate,
)


class DocumentChunkService:

    async def create_chunks(
        self,
        db: AsyncSession,
        document_id: UUID,
        chunks: list[str],
    ):

        created_chunks = []

        for index, chunk in enumerate(chunks):

            created_chunk = await document_chunk_repository.create_chunk(
                db=db,
                document_id=document_id,
                chunk_data=DocumentChunkCreate(
                    chunk_index=index,
                    content=chunk,
                ),
            )

            created_chunks.append(created_chunk)

        return created_chunks


    async def get_document_chunks(
        self,
        db: AsyncSession,
        document_id: UUID,
    ):

        return await document_chunk_repository.get_document_chunks(
            db=db,
            document_id=document_id,
        )


    async def delete_document_chunks(
        self,
        db: AsyncSession,
        document_id: UUID,
    ):

        await document_chunk_repository.delete_document_chunks(
            db=db,
            document_id=document_id,
        )


document_chunk_service = DocumentChunkService()