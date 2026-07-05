from datetime import datetime

from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from src.db.database import get_db

router = APIRouter(
    prefix="/health",
    tags=["Health"],
)


@router.get("")
async def health(
    db: AsyncSession = Depends(get_db),
):
    try:
        await db.execute(text("SELECT 1"))

        return {
            "status": "healthy",
            "database": "connected",
            "service": "mnemo-backend",
            "timestamp": datetime.utcnow().isoformat(),
        }

    except Exception:
        return {
            "status": "unhealthy",
            "database": "disconnected",
            "service": "mnemo-backend",
            "timestamp": datetime.utcnow().isoformat(),
        }