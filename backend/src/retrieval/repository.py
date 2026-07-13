from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.document_chunks.model import DocumentChunk
from src.documents.model import Document


class RetrievalRepository:

    async def semantic_search(
        self,
        db: AsyncSession,
        project_id: UUID,
        query_embedding: list[float],
        limit: int = 5,
    ):

        statement = (
    select(DocumentChunk, Document)
    .join(Document)
    .where(
        Document.project_id == project_id
    )
    .order_by(
        DocumentChunk.embedding.cosine_distance(query_embedding)
    )
    .limit(limit)
)

        result = await db.execute(statement)

        return result.all()


retrieval_repository = RetrievalRepository()