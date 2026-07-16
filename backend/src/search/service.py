from sqlalchemy.ext.asyncio import AsyncSession

from src.search.repository import search_repository
from src.search.schema import (
    SearchResponse,
    SearchResult,
)
from src.users.model import User


class SearchService:

    async def search(
        self,
        db: AsyncSession,
        current_user: User,
        query: str,
        filter: str,
    ) -> SearchResponse:

        results = []

        if filter in ("all", "project"):
            results.extend(
                await search_repository.search_projects(
                    db,
                    current_user.id,
                    query,
                )
            )

        if filter in ("all", "document"):
            results.extend(
                await search_repository.search_documents(
                    db,
                    current_user.id,
                    query,
                )
            )

        if filter in ("all", "note"):
            results.extend(
                await search_repository.search_notes(
                    db,
                    current_user.id,
                    query,
                )
            )

        if filter in ("all", "conversation"):
            results.extend(
                await search_repository.search_conversations(
                    db,
                    current_user.id,
                    query,
                )
            )

        results.sort(
            key=lambda item: (
                item["score"],
                item["created_at"],
            ),
            reverse=True,
        )

        return SearchResponse(
            ai_answer="",
            results=[
                SearchResult(**item)
                for item in results
            ],
        )


search_service = SearchService()