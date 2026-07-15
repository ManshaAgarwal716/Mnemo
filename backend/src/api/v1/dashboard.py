from fastapi import APIRouter, Depends

from sqlalchemy.ext.asyncio import AsyncSession

from src.dashboard.schema import DashboardResponse
from src.dashboard.service import dashboard_service

from src.db.database import get_db

from src.users.dependencies import get_current_user
from src.users.model import User

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"],
)


@router.get(
    "",
    response_model=DashboardResponse,
)
async def get_dashboard(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await dashboard_service.get_dashboard(
        db=db,
        current_user=current_user,
    )