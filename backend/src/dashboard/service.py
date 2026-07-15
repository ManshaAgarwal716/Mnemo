import uuid

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from src.conversations.model import Conversation
from src.dashboard.schema import (
    ActivityItem,
    DashboardResponse,
    DashboardStats,
)
from src.documents.model import Document
from src.notes.model import Note
from src.projects.model import Project
from src.users.model import User


class DashboardService:

    async def get_dashboard(
        self,
        db: AsyncSession,
        current_user: User,
    ) -> DashboardResponse:

        project_count = await db.scalar(
            select(func.count(Project.id)).where(
                Project.owner_id == current_user.id,
            )
        )

        document_count = await db.scalar(
            select(func.count(Document.id))
            .join(Project)
            .where(Project.owner_id == current_user.id)
        )

        note_count = await db.scalar(
            select(func.count(Note.id))
            .join(Project)
            .where(Project.owner_id == current_user.id)
        )

        conversation_count = await db.scalar(
            select(func.count(Conversation.id))
            .join(Project)
            .where(Project.owner_id == current_user.id)
        )

        activities: list[ActivityItem] = []

        projects = (
            await db.execute(
                select(Project)
                .where(
                    Project.owner_id == current_user.id,
                )
                .order_by(Project.updated_at.desc())
                .limit(5)
            )
        ).scalars().all()

        documents = (
            await db.execute(
                select(Document)
                .join(Project)
                .where(
                    Project.owner_id == current_user.id,
                )
                .order_by(Document.updated_at.desc())
                .limit(5)
            )
        ).scalars().all()

        notes = (
            await db.execute(
                select(Note)
                .join(Project)
                .where(
                    Project.owner_id == current_user.id,
                )
                .order_by(Note.updated_at.desc())
                .limit(5)
            )
        ).scalars().all()

        conversations = (
            await db.execute(
                select(Conversation)
                .join(Project)
                .where(
                    Project.owner_id == current_user.id,
                )
                .order_by(Conversation.updated_at.desc())
                .limit(5)
            )
        ).scalars().all()

        for project in projects:
            activities.append(
                ActivityItem(
                    id=str(project.id),
                    type="project",
                    name=project.name,
                    subtitle="Research project",
                    timestamp=project.updated_at,
                    project_id=str(project.id),
                )
            )

        for document in documents:
            activities.append(
                ActivityItem(
                    id=str(document.id),
                    type="document",
                    name=document.title,
                    subtitle=f"{document.file_type.upper()} document",
                    timestamp=document.updated_at,
                    project_id=str(document.project_id),
                    document_id=str(document.id),
                )
            )

        for note in notes:
            activities.append(
                ActivityItem(
                    id=str(note.id),
                    type="note",
                    name=note.title,
                    subtitle="Research note",
                    timestamp=note.updated_at,
                    project_id=str(note.project_id),
                )
            )

        for conversation in conversations:
            activities.append(
                ActivityItem(
                    id=str(conversation.id),
                    type="conversation",
                    name=conversation.title,
                    subtitle="AI conversation",
                    timestamp=conversation.updated_at,
                    project_id=str(conversation.project_id),
                    conversation_id=str(conversation.id),
                )
            )

        activities.sort(
            key=lambda x: x.timestamp,
            reverse=True,
        )

        return DashboardResponse(
            stats=DashboardStats(
                projects=project_count or 0,
                documents=document_count or 0,
                notes=note_count or 0,
                conversations=conversation_count or 0,
            ),
            recent_activity=activities[:10],
        )


dashboard_service = DashboardService()