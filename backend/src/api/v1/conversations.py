import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.conversations.schema import (
    ConversationCreate,
    ConversationUpdate,
    ConversationResponse,
)
from src.conversations.service import conversation_service
from src.db.database import get_db
from src.users.dependencies import get_current_user
from src.users.model import User

router = APIRouter(
    prefix="/conversations",
    tags=["Conversations"],
)


@router.post(
    "/{project_id}",
    response_model=ConversationResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_conversation(
    project_id: uuid.UUID,
    conversation_data: ConversationCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    try:

        return await conversation_service.create_conversation(
            db,
            project_id,
            conversation_data,
        )

    except ValueError as e:

        raise HTTPException(
            status_code=400,
            detail=str(e),
        )


@router.get(
    "/project/{project_id}",
    response_model=list[ConversationResponse],
)
async def get_conversations(
    project_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    return await conversation_service.get_conversations(
        db,
        project_id,
    )


@router.get(
    "/{conversation_id}",
    response_model=ConversationResponse,
)
async def get_conversation(
    conversation_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
):

    try:

        return await conversation_service.get_conversation(
            db,
            conversation_id,
        )

    except ValueError as e:

        raise HTTPException(
            status_code=404,
            detail=str(e),
        )


@router.patch(
    "/{conversation_id}",
    response_model=ConversationResponse,
)
async def update_conversation(
    conversation_id: uuid.UUID,
    conversation_data: ConversationUpdate,
    db: AsyncSession = Depends(get_db),
):

    try:

        return await conversation_service.update_conversation(
            db,
            conversation_id,
            conversation_data,
        )

    except ValueError as e:

        raise HTTPException(
            status_code=404,
            detail=str(e),
        )


@router.delete(
    "/{conversation_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_conversation(
    conversation_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
):

    try:

        await conversation_service.delete_conversation(
            db,
            conversation_id,
        )

    except ValueError as e:

        raise HTTPException(
            status_code=404,
            detail=str(e),
        )