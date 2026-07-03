import uuid

from sqlalchemy.ext.asyncio import AsyncSession

from src.projects.model import Project
from src.projects.repository import project_repository
from src.projects.schema import ProjectCreate, ProjectUpdate


class ProjectService:

    async def create_project(
        self,
        db: AsyncSession,
        owner_id: uuid.UUID,
        project_data: ProjectCreate,
    ) -> Project:

        existing_project = await project_repository.get_by_name(
            db,
            owner_id,
            project_data.name,
        )

        if existing_project:
            raise ValueError("Project with this name already exists.")

        project = Project(
            name=project_data.name,
            description=project_data.description,
            color=project_data.color,
            owner_id=owner_id,
        )

        return await project_repository.create(
            db,
            project,
        )

    async def get_projects(
        self,
        db: AsyncSession,
        owner_id: uuid.UUID,
    ):

        return await project_repository.get_all(
            db,
            owner_id,
        )

    async def get_project(
        self,
        db: AsyncSession,
        project_id: uuid.UUID,
        owner_id: uuid.UUID,
    ) -> Project:

        project = await project_repository.get_by_id(
            db,
            project_id,
        )

        if not project:
            raise ValueError("Project not found.")

        if project.owner_id != owner_id:
            raise ValueError("You don't have access to this project.")

        return project

    async def update_project(
        self,
        db: AsyncSession,
        project_id: uuid.UUID,
        owner_id: uuid.UUID,
        project_data: ProjectUpdate,
    ) -> Project:

        project = await self.get_project(
            db,
            project_id,
            owner_id,
        )

        update_data = project_data.model_dump(
            exclude_unset=True
        )

        for key, value in update_data.items():
            setattr(
                project,
                key,
                value,
            )

        return await project_repository.update(
            db,
            project,
        )

    async def delete_project(
        self,
        db: AsyncSession,
        project_id: uuid.UUID,
        owner_id: uuid.UUID,
    ) -> None:

        project = await self.get_project(
            db,
            project_id,
            owner_id,
        )

        await project_repository.delete(
            db,
            project,
        )


project_service = ProjectService()