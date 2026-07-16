from sqlalchemy.ext.asyncio import AsyncSession

from src.users.model import User
from src.users.schema import (
    UserCreate,
    UserLogin,
    UserUpdate,
    PasswordUpdate,
)
from src.projects.repository import project_repository
from src.users.repository import user_repository
import os

from src.documents.repository import document_repository
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
            hashed_password=hash_password(
                user_data.password,
            ),
        )

        return await user_repository.create(
            db,
            user,
        )

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
            raise ValueError(
                "Invalid email or password."
            )

        if not verify_password(
            user_data.password,
            user.hashed_password,
        ):
            raise ValueError(
                "Invalid email or password."
            )

        token = create_access_token(
            {
                "sub": str(user.id),
            }
        )

        return user, token

    async def update_profile(
        self,
        db: AsyncSession,
        current_user: User,
        user_data: UserUpdate,
    ) -> User:

        current_user.name = user_data.name

        return await user_repository.update(
            db,
            current_user,
        )

    async def change_password(
        self,
        db: AsyncSession,
        current_user: User,
        password_data: PasswordUpdate,
    ) -> User:

        if not verify_password(
            password_data.current_password,
            current_user.hashed_password,
        ):
            raise ValueError(
                "Current password is incorrect."
            )

        current_user.hashed_password = hash_password(
            password_data.new_password,
        )

        return await user_repository.update(
            db,
            current_user,
        )
    async def delete_account(
        self,
        db: AsyncSession,
        current_user: User,
        password: str,
    ) -> None:

        if not verify_password(
            password,
            current_user.hashed_password,
        ):
            raise ValueError(
                "Incorrect password."
            )

        projects = await project_repository.get_all(
    db,
    current_user.id,
)

        for project in projects:

            documents = await document_repository.get_all_by_project(
                db,
                project.id,
            )

            for document in documents:

                if (
                    document.file_path
                    and os.path.exists(document.file_path)
                ):
                    os.remove(
                        document.file_path
                    )

        await user_repository.delete(
            db,
            current_user,
        )


user_service = UserService()