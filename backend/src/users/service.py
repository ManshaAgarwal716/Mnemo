from sqlalchemy.ext.asyncio import AsyncSession

from src.users.model import User
from src.users.schema import UserCreate, UserLogin
from src.users.repository import user_repository

from src.core.security import (
    hash_password,
    verify_password,
    create_access_token,
)


class UserService:

    async def signup(
        self,
        db: AsyncSession,
        user_data: UserCreate,
    ) -> User:

        existing_user = await user_repository.get_by_email(
            db,
            user_data.email,
        )

        if existing_user:
            raise ValueError("Email already exists.")

        user = User(
            name=user_data.name,
            email=user_data.email,
            hashed_password=hash_password(user_data.password),
        )

        return await user_repository.create(db, user)

    async def login(
        self,
        db: AsyncSession,
        user_data: UserLogin,
    ) -> tuple[User, str]:

        user = await user_repository.get_by_email(
            db,
            user_data.email,
        )

        if not user:
            raise ValueError("Invalid email or password.")

        if not verify_password(
            user_data.password,
            user.hashed_password,
        ):
            raise ValueError("Invalid email or password.")

        token = create_access_token(
            {
                "sub": str(user.id),
            }
        )

        return user, token


user_service = UserService()