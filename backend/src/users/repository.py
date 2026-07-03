from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.users.model import User


class UserRepository:
    async def get_by_email(
        self,
        db: AsyncSession,
        email: str,
    ) -> User | None:

        result = await db.execute(
            select(User).where(User.email == email)
        )

        return result.scalar_one_or_none()

    async def get_by_id(
        self,
        db: AsyncSession,
        user_id: UUID,
    ) -> User | None:

        result = await db.execute(
            select(User).where(User.id == user_id)
        )

        return result.scalar_one_or_none()

    async def create(
        self,
        db: AsyncSession,
        user: User,
    ) -> User:

        db.add(user)

        await db.commit()

        await db.refresh(user)

        return user

    async def update(
        self,
        db: AsyncSession,
        user: User,
    ) -> User:

        await db.commit()

        await db.refresh(user)

        return user

    async def delete(
        self,
        db: AsyncSession,
        user: User,
    ) -> None:

        await db.delete(user)

        await db.commit()
user_repository = UserRepository()