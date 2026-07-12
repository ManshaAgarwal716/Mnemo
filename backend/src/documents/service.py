import uuid

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from src.documents.model import Document
from src.documents.repository import document_repository
from src.documents.schema import (
    DocumentCreate,
    DocumentUpdate,
)
from src.processing.service import processing_service
from src.document_chunks.service import (
    document_chunk_service,
)

class DocumentService:

    async def create_document(
        self,
        db: AsyncSession,
        project_id: uuid.UUID,
        document_data: DocumentCreate,
        file_name: str,
        file_path: str,
        file_type: str,
        file_size: int,
    ) -> Document:

        document = Document(
            title=document_data.title,
            file_name=file_name,
            file_path=file_path,
            file_type=file_type,
            file_size=file_size,
            project_id=project_id,
        )

        created_document = await document_repository.create(
            db,
            document,
        )

        text = processing_service.extract_text(
            created_document.file_path,
        )

        chunks = processing_service.chunk_text(
            text,
        )
        embeddings = processing_service.generate_embeddings(
    chunks,
)
        await document_chunk_service.create_chunks(
            db=db,
            document_id=created_document.id,
            chunks=chunks,
            embeddings=embeddings,
        )

        return created_document

    async def get_documents(
        self,
        db: AsyncSession,
        project_id: uuid.UUID,
    ):

        return await document_repository.get_all_by_project(
            db,
            project_id,
        )

    async def get_document(
        self,
        db: AsyncSession,
        document_id: uuid.UUID,
    ) -> Document:

        document = await document_repository.get_by_id(
            db,
            document_id,
        )

        if not document:
            raise ValueError("Document not found.")

        return document

    async def update_document(
        self,
        db: AsyncSession,
        document_id: uuid.UUID,
        document_data: DocumentUpdate,
    ) -> Document:

        document = await self.get_document(
            db,
            document_id,
        )

        update_data = document_data.model_dump(
            exclude_unset=True
        )
        for key, value in update_data.items():
            setattr(
                document,
                key,
                value,
            )

        return await document_repository.update(
            db,
            document,
        )

    async def delete_document(
        self,
        db: AsyncSession,
        document_id: uuid.UUID,
    ) -> None:

        document = await self.get_document(
            db,
            document_id,
        )

        await document_repository.delete(
            db,
            document,
        )


document_service = DocumentService()