"""Isolated API fixtures backed by a disposable pgvector database and Redis."""

import os
import uuid

os.environ.update({
    "DATABASE_URL": "postgresql+asyncpg://postgres:mnemo_test_password@127.0.0.1:55433/mnemo_security_test",
    "SYNC_DATABASE_URL": "postgresql://postgres:mnemo_test_password@127.0.0.1:55433/mnemo_security_test",
    "JWT_SECRET": "isolated-test-secret-change-me",
    "REDIS_URL": "redis://127.0.0.1:56379/15",
    "MAIL_USERNAME": "test", "MAIL_PASSWORD": "test", "MAIL_FROM": "test@example.test",
    "MAIL_PORT": "1025", "MAIL_SERVER": "localhost", "FRONTEND_URL": "http://localhost:3000",
    "APP_ENV": "test", "GEMINI_API_KEY": "test", "GROQ_API_KEY": "test",
    "SUPABASE_URL": "https://example.supabase.co", "SUPABASE_SERVICE_KEY": "test-key",
    "GOOGLE_CLIENT_ID": "test-client-id",
})

import pytest_asyncio
import pytest
from httpx import ASGITransport, AsyncClient
from sqlalchemy import text
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine

from src.db.base import Base
from src.db.database import get_db
from src.main import app
from src.users.model import User
from src.projects.model import Project
from src.documents.model import Document
from src.notes.model import Note
from src.notes.chunk import NoteChunk
from src.conversations.model import Conversation
from src.messages.model import Message
from src.document_chunks.model import DocumentChunk
from src.core.config import settings
from src.core.rate_limit import limiter
from src.processing.service import processing_service


@pytest.fixture(autouse=True)
def fake_embeddings(monkeypatch):
    vector = [1.0] + [0.0] * 3071
    monkeypatch.setattr(processing_service, "generate_embedding", lambda text, task_type="RETRIEVAL_DOCUMENT": vector)
    monkeypatch.setattr(processing_service, "generate_embeddings", lambda chunks: [vector for _ in chunks])


@pytest_asyncio.fixture(loop_scope="session")
async def api():
    limiter.enabled = False  # Auth behavior is tested without shared per-IP limits.
    schema = f"mnemo_security_{uuid.uuid4().hex}"
    admin = create_async_engine(settings.DATABASE_URL)
    async with admin.begin() as connection:
        await connection.execute(text("CREATE EXTENSION IF NOT EXISTS vector"))
        await connection.execute(text(f'CREATE SCHEMA "{schema}"'))
    engine = create_async_engine(
        settings.DATABASE_URL,
        connect_args={"server_settings": {"search_path": f"{schema},public"}},
    )
    async with engine.begin() as connection:
        # Always create tables in the temporary schema, even when a migration
        # verification database already has tables in its public schema.
        await connection.run_sync(lambda sync_connection: Base.metadata.create_all(sync_connection, checkfirst=False))
    sessions = async_sessionmaker(engine, expire_on_commit=False)

    async def test_db():
        async with sessions() as session:
            yield session

    app.dependency_overrides[get_db] = test_db
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://testserver") as client:
        yield client, sessions
    app.dependency_overrides.clear()
    limiter.enabled = True
    await engine.dispose()
    async with admin.begin() as connection:
        await connection.execute(text(f'DROP SCHEMA "{schema}" CASCADE'))
    await admin.dispose()


async def registered_user(client, email: str, name: str):
    password = "secure-test-password"
    response = await client.post("/api/v1/auth/signup", json={"name": name, "email": email, "password": password})
    assert response.status_code == 201, response.text
    response = await client.post("/api/v1/auth/login", json={"email": email, "password": password})
    assert response.status_code == 200, response.text
    return {"Authorization": f"Bearer {response.json()['token']}"}, response.json()["user"]["id"]


async def project(client, headers, name):
    response = await client.post("/api/v1/projects/", headers=headers, json={"name": name, "description": "Test project", "color": "#76543E"})
    assert response.status_code == 201, response.text
    return response.json()["id"]
