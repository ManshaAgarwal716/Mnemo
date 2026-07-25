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

        rows = await retrieval_repository.semantic_search(
            db=db,
            project_id=project_id,
            query_embedding=query_embedding,
        )

        results = []

        for chunk, document, distance in rows:

            similarity = max(
                0,
                round((1 - distance) * 100)
            )

            results.append(
                {
                    "chunk": chunk,
                    "document": document,
                    "distance": distance,
                    "similarity": similarity,
                }
            )

        return results


retrieval_service = RetrievalService()