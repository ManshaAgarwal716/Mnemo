import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.db.database import get_db
from src.notes.schema import (
    NoteCreate,
    NoteUpdate,
    NoteResponse,
)
from src.notes.service import note_service
from src.users.dependencies import get_current_user
from src.users.model import User

router = APIRouter(
    prefix="/projects",
    tags=["Notes"],
)


@router.post(
    "/{project_id}/notes",
    response_model=NoteResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_note(
    project_id: uuid.UUID,
    note_data: NoteCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        return await note_service.create_note(
            db,
            project_id,
            note_data,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )


@router.get(
    "/{project_id}/notes",
    response_model=list[NoteResponse],
)
async def get_notes(
    project_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await note_service.get_notes(
        db,
        project_id,
    )


@router.get(
    "/notes/{note_id}",
    response_model=NoteResponse,
)
async def get_note(
    note_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        return await note_service.get_note(
            db,
            note_id,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e),
        )


@router.patch(
    "/notes/{note_id}",
    response_model=NoteResponse,
)
async def update_note(
    note_id: uuid.UUID,
    note_data: NoteUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        return await note_service.update_note(
            db,
            note_id,
            note_data,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e),
        )


@router.delete(
    "/notes/{note_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_note(
    note_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        await note_service.delete_note(
            db,
            note_id,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e),
        )