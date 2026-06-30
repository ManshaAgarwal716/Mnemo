from datetime import timedelta

from fastapi import (
    APIRouter,
    BackgroundTasks,
    Depends,
    HTTPException,
    status,
)
from fastapi.responses import JSONResponse
from sqlmodel.ext.asyncio.session import AsyncSession

from src.config import settings
from src.db.main import get_session
from src.db.redis import add_token_to_blocklist

from src.mail import create_message, mail

from src.users.dependencies import (
    AccessTokenBearer,
    RefreshTokenBearer,
    RoleChecker,
    get_current_user,
)

from src.users.models import User
from src.users.schemas import (
    EmailModel,
    LoginResponse,
    MessageResponse,
    SignupResponse,
    UserCreate,
    UserLogin,
    UserModel,
)

from src.users.services import UserService

from src.users.utils import (
    create_access_token,
    decode_email_token,
    generate_email_token,
    verify_password,
)

router = APIRouter(
    prefix="/users",
    tags=["Users"],
)

role_checker = RoleChecker(
    allowed_roles=["admin", "user"]
)


def get_user_service() -> UserService:
    return UserService()
@router.post(
    "/signup",
    response_model=SignupResponse,
    status_code=status.HTTP_201_CREATED,
)
async def signup(
    user_data: UserCreate,
    background_tasks: BackgroundTasks,
    session: AsyncSession = Depends(get_session),
    user_service: UserService = Depends(get_user_service),
):

    existing_user = await user_service.user_exists(
        user_data.email,
        session,
    )

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists",
        )

    new_user = await user_service.create_user(
        user_data,
        session,
    )

    token = generate_email_token(
        {"email": new_user.email}
    )

    verification_link = (
        f"{settings.FRONTEND_URL}"
        f"/verify-email?token={token}"
    )

    html_message = f"""
    <h1>Welcome to Mnemo</h1>

    <p>Hi {new_user.email},</p>

    <p>Please verify your email by clicking below:</p>

    <a href="{verification_link}">
        Verify Email
    </a>
    """

    message = create_message(
        subject="Verify Your Email",
        body=html_message,
        recipients=[new_user.email],
    )

    background_tasks.add_task(
        mail.send_message,
        message,
    )

    return SignupResponse(
        message="User created successfully. Please verify your email.",
        user=new_user,
    )
@router.get(
    "/verify-email",
    response_model=MessageResponse,
)
async def verify_email(
    token: str,
    session: AsyncSession = Depends(get_session),
    user_service: UserService = Depends(get_user_service),
):

    email = decode_email_token(token)

    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired token",
        )

    user = await user_service.get_user_by_email(
        email,
        session,
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    if user.is_verified:
        return MessageResponse(
            message="Email already verified"
        )

    user.is_verified = True

    session.add(user)
    await session.commit()

    return MessageResponse(
        message="Email verified successfully"
    )
@router.post(
    "/login",
    response_model=LoginResponse,
)
async def login(
    user_data: UserLogin,
    session: AsyncSession = Depends(get_session),
    user_service: UserService = Depends(get_user_service),
):

    user = await user_service.get_user_by_email(
        user_data.email,
        session,
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    if not verify_password(
        user_data.password,
        user.password_hash,
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    if not user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Please verify your email first",
        )

    access_token = create_access_token(
        user_data={
            "email": user.email,
            "user_uid": str(user.uid),
        }
    )

    refresh_token = create_access_token(
        user_data={
            "email": user.email,
            "user_uid": str(user.uid),
        },
        refresh=True,
        expiry=timedelta(days=7),
    )

    return LoginResponse(
        message="Login successful",
        access_token=access_token,
        refresh_token=refresh_token,
        user=UserModel.model_validate(user),
    )
@router.post(
    "/refresh-token",
    response_model=MessageResponse,
)
async def refresh_token(
    token_data: dict = Depends(
        RefreshTokenBearer()
    ),
):

    new_access_token = create_access_token(
        user_data=token_data["user"]
    )

    return {
        "message": "Token refreshed",
        "access_token": new_access_token,
    }
@router.get(
    "/me",
    response_model=UserModel,
    dependencies=[Depends(role_checker)],
)
async def get_me(
    user: User = Depends(get_current_user),
):
    return user
@router.post(
    "/logout",
    response_model=MessageResponse,
)
async def logout(
    token_data: dict = Depends(
        AccessTokenBearer()
    ),
):

    jti = token_data.get("jti")

    await add_token_to_blocklist(jti)

    return MessageResponse(
        message="Logged out successfully"
    )
@router.post(
    "/send-email",
    response_model=MessageResponse,
)
async def send_email(
    email_data: EmailModel,
    background_tasks: BackgroundTasks,
):

    html = """
    <h1>Test Email</h1>

    <p>This is a test email from Mnemo.</p>
    """

    message = create_message(
        subject="Test Email",
        body=html,
        recipients=email_data.emails,
    )

    background_tasks.add_task(
        mail.send_message,
        message,
    )

    return MessageResponse(
        message="Emails queued successfully"
    )