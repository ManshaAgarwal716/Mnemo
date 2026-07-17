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
        print("OWNER ID:", owner_id)

        result = await db.execute(
            select(Project).where(
                Project.owner_id == owner_id
            )
        )

        projects = result.scalars().all()

        print("PROJECTS:", [p.name for p in projects])

        return projects

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
    async def get_by_name(
    self,
    db: AsyncSession,
    owner_id: uuid.UUID,
    name: str,
) -> Project | None:

        result = await db.execute(
            select(Project).where(
                Project.owner_id == owner_id,
                Project.name == name,
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