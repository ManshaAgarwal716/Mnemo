from fastapi import (
    APIRouter,
    Depends,
)

from sqlalchemy.ext.asyncio import AsyncSession

from src.db.database import get_db

from src.search.schema import (
    SearchRequest,
    SearchResponse,
)

from src.search.service import search_service

from src.users.dependencies import get_current_user
from src.users.model import User

router = APIRouter(
    prefix="/search",
    tags=["Search"],
)
@router.post(
    "",
    response_model=SearchResponse,
)
async def search(
    request: SearchRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    return await search_service.search(
    db=db,
    current_user=current_user,
    query=request.query,
    filter=request.filter,
)