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
    GoogleAuthRequest,
)
from google.oauth2 import id_token
from google.auth.transport import requests

from pydantic import BaseModel
from src.core.config import settings
from src.users.service import user_service
from src.auth.blocklist import token_blocklist
from fastapi.security import OAuth2PasswordBearer
from src.core.security import (
    decode_access_token,
    get_token_remaining_seconds,
)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)
oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/api/v1/auth/login",
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

@router.post(
    "/google",
    response_model=TokenResponse,
)
async def google_login(
    data: GoogleAuthRequest,
    db: AsyncSession = Depends(get_db),
):
    try:
        idinfo = id_token.verify_oauth2_token(
            data.token,
            requests.Request(),
            settings.GOOGLE_CLIENT_ID,
        )

        email = idinfo["email"]
        name = idinfo.get("name", email.split("@")[0])

        user, token = await user_service.google_login(
            db,
            email=email,
            name=name,
        )

        return TokenResponse(
            user=user,
            token=token,
        )

    except Exception:
        raise HTTPException(
            status_code=401,
            detail="Invalid Google token",
        )


@router.get(
    "/me",
    response_model=UserResponse,
)
async def me(
    current_user: User = Depends(get_current_user),
):
    return current_user
@router.post("/logout")
async def logout(
    token: str = Depends(oauth2_scheme),
):
    payload = decode_access_token(token)

    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        )

    jti = payload.get("jti")

    if jti is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        )

    expires_in = get_token_remaining_seconds(
        payload,
    )

    await token_blocklist.block_token(
        jti,
        expires_in,
    )

    return {
        "message": "Logged out successfully.",
    }