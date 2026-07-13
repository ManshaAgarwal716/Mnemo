import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.notes.model import Note


class NoteRepository:

    async def create(
        self,
        db: AsyncSession,
        note: Note,
    ) -> Note:

        db.add(note)

        await db.commit()

        await db.refresh(note)

        return note

    async def get_all_by_project(
        self,
        db: AsyncSession,
        project_id: uuid.UUID,
    ) -> list[Note]:

        result = await db.execute(
            select(Note).where(
                Note.project_id == project_id
            )
        )

        return result.scalars().all()

    async def get_by_id(
        self,
        db: AsyncSession,
        note_id: uuid.UUID,
    ) -> Note | None:

        result = await db.execute(
            select(Note).where(
                Note.id == note_id
            )
        )

        return result.scalar_one_or_none()

    async def update(
        self,
        db: AsyncSession,
        note: Note,
    ) -> Note:

        await db.commit()

        await db.refresh(note)

        return note

    async def delete(
        self,
        db: AsyncSession,
        note: Note,
    ) -> None:

        await db.delete(note)

        await db.commit()


note_repository = NoteRepository()