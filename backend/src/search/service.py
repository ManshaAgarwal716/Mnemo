from sqlalchemy.ext.asyncio import AsyncSession

from src.search.repository import search_repository
from src.search.schema import SearchResponse


class SearchService:

    async def search(
        self,
        db: AsyncSession,
        query: str,
    ) -> SearchResponse:

        projects = await search_repository.search_projects(
            db,
            query,
        )

        documents = await search_repository.search_documents(
            db,
            query,
        )

        notes = await search_repository.search_notes(
            db,
            query,
        )

        return SearchResponse(
            projects=projects,
            documents=documents,
            notes=notes,
        )


search_service = SearchService()