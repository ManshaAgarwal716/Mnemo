"""Ownership guards for resources reachable through a user's research projects."""

import uuid

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.conversations.model import Conversation
from src.documents.model import Document
from src.messages.model import Message
from src.notes.model import Note
from src.projects.model import Project


def _not_found() -> HTTPException:
    # Do not reveal whether another user's resource exists.
    return HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resource not found")


async def require_project(db: AsyncSession, project_id: uuid.UUID, user_id: uuid.UUID) -> Project:
    project = await db.scalar(
        select(Project).where(Project.id == project_id, Project.owner_id == user_id)
    )
    if project is None:
        raise _not_found()
    return project


async def require_document(db: AsyncSession, document_id: uuid.UUID, user_id: uuid.UUID) -> Document:
    document = await db.scalar(
        select(Document)
        .join(Project, Document.project_id == Project.id)
        .where(Document.id == document_id, Project.owner_id == user_id)
    )
    if document is None:
        raise _not_found()
    return document


async def require_note(db: AsyncSession, note_id: uuid.UUID, user_id: uuid.UUID) -> Note:
    note = await db.scalar(
        select(Note)
        .join(Project, Note.project_id == Project.id)
        .where(Note.id == note_id, Project.owner_id == user_id)
    )
    if note is None:
        raise _not_found()
    return note


async def require_conversation(db: AsyncSession, conversation_id: uuid.UUID, user_id: uuid.UUID) -> Conversation:
    conversation = await db.scalar(
        select(Conversation)
        .join(Project, Conversation.project_id == Project.id)
        .where(Conversation.id == conversation_id, Project.owner_id == user_id)
    )
    if conversation is None:
        raise _not_found()
    return conversation


async def require_message(db: AsyncSession, message_id: uuid.UUID, user_id: uuid.UUID) -> Message:
    message = await db.scalar(
        select(Message)
        .join(Conversation, Message.conversation_id == Conversation.id)
        .join(Project, Conversation.project_id == Project.id)
        .where(Message.id == message_id, Project.owner_id == user_id)
    )
    if message is None:
        raise _not_found()
    return message
