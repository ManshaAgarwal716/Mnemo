import uuid

from sqlalchemy.ext.asyncio import AsyncSession

from src.notes.model import Note
from src.notes.repository import note_repository
from src.notes.schema import (
    NoteCreate,
    NoteUpdate,
)


class NoteService:

    async def create_note(
        self,
        db: AsyncSession,
        project_id: uuid.UUID,
        note_data: NoteCreate,
    ) -> Note:

        note = Note(
            title=note_data.title,
            content=note_data.content,
            project_id=project_id,
        )

        return await note_repository.create(
            db,
            note,
        )

    async def get_notes(
        self,
        db: AsyncSession,
        project_id: uuid.UUID,
    ):

        return await note_repository.get_all_by_project(
            db,
            project_id,
        )

    async def get_note(
        self,
        db: AsyncSession,
        note_id: uuid.UUID,
    ) -> Note:

        note = await note_repository.get_by_id(
            db,
            note_id,
        )

        if not note:
            raise ValueError("Note not found.")

        return note

    async def update_note(
        self,
        db: AsyncSession,
        note_id: uuid.UUID,
        note_data: NoteUpdate,
    ) -> Note:

        note = await self.get_note(
            db,
            note_id,
        )

        update_data = note_data.model_dump(
            exclude_unset=True,
        )

        for key, value in update_data.items():
            setattr(
                note,
                key,
                value,
            )

        return await note_repository.update(
            db,
            note,
        )

    async def delete_note(
        self,
        db: AsyncSession,
        note_id: uuid.UUID,
    ) -> None:

        note = await self.get_note(
            db,
            note_id,
        )

        await note_repository.delete(
            db,
            note,
        )


note_service = NoteService()