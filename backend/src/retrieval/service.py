from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from src.processing.service import processing_service
from src.retrieval.repository import retrieval_repository


class RetrievalService:

    async def retrieve_chunks(
        self,
        db: AsyncSession,
        project_id: UUID,
        question: str,
    ):

        query_embedding = (
            processing_service.generate_embedding(
                question,
                task_type="RETRIEVAL_QUERY",
            )
        )

        chunks = (
            await retrieval_repository.semantic_search(
                db=db,
                project_id=project_id,
                query_embedding=query_embedding,
            )
        )

        return chunks


retrieval_service = RetrievalService()