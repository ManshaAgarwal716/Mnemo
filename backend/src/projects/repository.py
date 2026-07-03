import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.projects.model import Project


class ProjectRepository:

    async def create(
        self,
        db: AsyncSession,
        project: Project,
    ) -> Project:

        db.add(project)

        await db.commit()

        await db.refresh(project)

        return project


    async def get_all(
        self,
        db: AsyncSession,
        owner_id: uuid.UUID,
    ) -> list[Project]:

        result = await db.execute(
            select(Project).where(
                Project.owner_id == owner_id
            )
        )

        return result.scalars().all()


    async def get_by_id(
        self,
        db: AsyncSession,
        project_id: uuid.UUID,
    ) -> Project | None:

        result = await db.execute(
            select(Project).where(
                Project.id == project_id
            )
        )

        return result.scalar_one_or_none()


    async def update(
        self,
        db: AsyncSession,
        project: Project,
    ) -> Project:

        await db.commit()

        await db.refresh(project)

        return project


    async def delete(
        self,
        db: AsyncSession,
        project: Project,
    ) -> None:

        await db.delete(project)

        await db.commit()


project_repository = ProjectRepository()