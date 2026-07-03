import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.db.database import get_db
from src.projects.schema import (
    ProjectCreate,
    ProjectUpdate,
    ProjectResponse,
)
from src.projects.service import project_service
from src.users.dependencies import get_current_user
from src.users.model import User

router = APIRouter(
    prefix="/projects",
    tags=["Projects"],
)


@router.post(
    "/",
    response_model=ProjectResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_project(
    project_data: ProjectCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    try:
        return await project_service.create_project(
            db,
            current_user.id,
            project_data,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )


@router.get(
    "/",
    response_model=list[ProjectResponse],
)
async def get_projects(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    return await project_service.get_projects(
        db,
        current_user.id,
    )


@router.get(
    "/{project_id}",
    response_model=ProjectResponse,
)
async def get_project(
    project_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    try:
        return await project_service.get_project(
            db,
            project_id,
            current_user.id,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e),
        )


@router.patch(
    "/{project_id}",
    response_model=ProjectResponse,
)
async def update_project(
    project_id: uuid.UUID,
    project_data: ProjectUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    try:
        return await project_service.update_project(
            db,
            project_id,
            current_user.id,
            project_data,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )


@router.delete(
    "/{project_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_project(
    project_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    try:
        await project_service.delete_project(
            db,
            project_id,
            current_user.id,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e),
        )