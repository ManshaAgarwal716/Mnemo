import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.db.database import get_db
from src.messages.schema import (
    MessageCreate,
    MessageUpdate,
    MessageResponse,
)
from src.messages.service import message_service
from src.users.dependencies import get_current_user
from src.users.model import User

router = APIRouter(
    prefix="/messages",
    tags=["Messages"],
)


@router.post(
    "/{conversation_id}",
    response_model=MessageResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_message(
    conversation_id: uuid.UUID,
    message_data: MessageCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    try:

        return await message_service.create_message(
            db,
            conversation_id,
            message_data,
        )

    except ValueError as e:

        raise HTTPException(
            status_code=400,
            detail=str(e),
        )


@router.get(
    "/conversation/{conversation_id}",
    response_model=list[MessageResponse],
)
async def get_messages(
    conversation_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    return await message_service.get_messages(
        db,
        conversation_id,
    )


@router.get(
    "/{message_id}",
    response_model=MessageResponse,
)
async def get_message(
    message_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    try:

        return await message_service.get_message(
            db,
            message_id,
        )

    except ValueError as e:

        raise HTTPException(
            status_code=404,
            detail=str(e),
        )


@router.patch(
    "/{message_id}",
    response_model=MessageResponse,
)
async def update_message(
    message_id: uuid.UUID,
    message_data: MessageUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    try:

        return await message_service.update_message(
            db,
            message_id,
            message_data,
        )

    except ValueError as e:

        raise HTTPException(
            status_code=404,
            detail=str(e),
        )


@router.delete(
    "/{message_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_message(
    message_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    try:

        await message_service.delete_message(
            db,
            message_id,
        )

    except ValueError as e:

        raise HTTPException(
            status_code=404,
            detail=str(e),
        )