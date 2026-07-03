from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.db.database import get_db
from src.users.dependencies import get_current_user
from src.users.model import User
from src.users.schema import (
    UserCreate,
    UserLogin,
    UserResponse,
    TokenResponse,
)
from src.users.service import user_service

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


@router.post(
    "/signup",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
async def signup(
    user_data: UserCreate,
    db: AsyncSession = Depends(get_db),
):
    try:
        return await user_service.signup(
            db,
            user_data,
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.post(
    "/login",
    response_model=TokenResponse,
)
async def login(
    user_data: UserLogin,
    db: AsyncSession = Depends(get_db),
):
    try:
        user, token = await user_service.login(
            db,
            user_data,
        )

        return TokenResponse(
            user=user,
            token=token,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
        )


@router.get(
    "/me",
    response_model=UserResponse,
)
async def me(
    current_user: User = Depends(get_current_user),
):
    return current_user