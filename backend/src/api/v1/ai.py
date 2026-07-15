import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from src.ai.related_service import related_service
from src.ai.schema import ChatRequest, ChatResponse
from src.ai.service import ai_service
from src.ai.summary_service import summary_service
from src.db.database import get_db
from src.users.dependencies import get_current_user
from src.users.model import User

router = APIRouter(
    prefix="/ai",
    tags=["AI"],
)


@router.post(
    "/chat",
    response_model=ChatResponse,
)
async def chat(
    request: ChatRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    try:
        return await ai_service.chat(
            db=db,
            conversation_id=request.conversation_id,
            prompt=request.message,
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e),
        )


@router.get("/summary/{conversation_id}")
async def get_summary(
    conversation_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    try:
        return await summary_service.generate_summary(
            db,
            conversation_id,
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e),
        )


@router.get("/related/{conversation_id}")
async def get_related(
    conversation_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    try:
        return await related_service.find_related_content(
            db,
            conversation_id,
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e),
        )