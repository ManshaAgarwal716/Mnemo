import pytest
from uuid import UUID
from sqlalchemy import select

from conftest import project, registered_user
from src.ai.service import ai_service
from src.notes.chunk import NoteChunk
from src.documents.model import Document
from src.document_chunks.model import DocumentChunk
from src.retrieval.service import retrieval_service
from src.processing.service import processing_service
from fastapi import HTTPException

pytestmark = pytest.mark.asyncio(loop_scope="session")


async def test_note_is_indexed_updated_and_cited_in_chat(api, monkeypatch):
    client, sessions = api
    headers, _ = await registered_user(client, "notes-rag@example.com", "Notes Researcher")
    project_id = await project(client, headers, "Fieldwork")

    note = await client.post(
        f"/api/v1/projects/{project_id}/notes", headers=headers,
        json={"title": "Field observation", "content": "<p>The leaves turn purple in winter.</p>"},
    )
    assert note.status_code == 201, note.text
    note_id = note.json()["id"]
    note_uuid = UUID(note_id)
    async with sessions() as db:
        chunks = (await db.scalars(select(NoteChunk).where(NoteChunk.note_id == note_uuid))).all()
        assert len(chunks) == 1
        assert "leaves turn purple" in chunks[0].content
        assert "<p>" not in chunks[0].content

    updated = await client.patch(
        f"/api/v1/projects/notes/{note_id}", headers=headers,
        json={"content": "<p>The leaves turn gold in autumn.</p>"},
    )
    assert updated.status_code == 200, updated.text
    async with sessions() as db:
        chunks = (await db.scalars(select(NoteChunk).where(NoteChunk.note_id == note_uuid))).all()
        assert len(chunks) == 1
        assert "leaves turn gold" in chunks[0].content
        assert "purple" not in chunks[0].content

    conversation = await client.post(
        f"/api/v1/conversations/{project_id}", headers=headers,
        json={"title": "New conversation"},
    )
    assert conversation.status_code == 201, conversation.text
    captured = {}

    async def generate(history, prompt, context):
        captured["context"] = context
        return "The note says the leaves turn gold in autumn."

    async def generate_title(prompt):
        return "Autumn leaf notes"

    monkeypatch.setattr(ai_service.provider, "generate", generate)
    monkeypatch.setattr(ai_service.provider, "generate_title", generate_title)
    reply = await client.post(
        "/api/v1/ai/chat", headers=headers,
        json={"conversation_id": conversation.json()["id"], "message": "Summarize my field observation"},
    )
    assert reply.status_code == 200, reply.text
    assert "[Note: Field observation]" in captured["context"]
    assert "leaves turn gold" in captured["context"]
    assert reply.json()["sources"][0]["note_id"] == note_id
    assert reply.json()["sources"][0]["document_id"] is None

    deleted = await client.delete(f"/api/v1/projects/notes/{note_id}", headers=headers)
    assert deleted.status_code == 204
    async with sessions() as db:
        assert (await db.scalars(select(NoteChunk).where(NoteChunk.note_id == note_uuid))).all() == []
    after_delete = await client.post(
        "/api/v1/ai/chat", headers=headers,
        json={"conversation_id": conversation.json()["id"], "message": "Summarize my field observation"},
    )
    assert after_delete.status_code == 200, after_delete.text
    assert after_delete.json()["sources"] == []
    assert "couldn't find enough" in after_delete.json()["response"]


async def test_mixed_sources_and_scope(api, monkeypatch):
    client, sessions = api
    headers, owner_id = await registered_user(client, "mixed-rag@example.com", "Mixed Researcher")
    first = await project(client, headers, "First project")
    second = await project(client, headers, "Second project")
    first_note = (await client.post(
        f"/api/v1/projects/{first}/notes", headers=headers,
        json={"title": "Docker note", "content": "Containers share the host kernel."},
    )).json()["id"]
    second_note = (await client.post(
        f"/api/v1/projects/{second}/notes", headers=headers,
        json={"title": "Kubernetes note", "content": "Pods group containers."},
    )).json()["id"]
    async with sessions() as db:
        document = Document(
            title="Container paper", file_name="containers.pdf", file_path="test/containers.pdf",
            file_type="pdf", file_size=100, project_id=UUID(first),
        )
        db.add(document)
        await db.flush()
        db.add(DocumentChunk(
            document_id=document.id, chunk_index=0,
            content="Containers package applications.", embedding=[1.0] + [0.0] * 3071,
        ))
        await db.commit()

        project_items = await retrieval_service.retrieve_context(
            db, UUID(first), UUID(owner_id), "Explain containers"
        )
        assert {item["kind"] for item in project_items} == {"note", "document"}
        assert all((item.get("note") or item.get("document")).project_id == UUID(first) for item in project_items)

        all_items = await retrieval_service.retrieve_context(
            db, UUID(first), UUID(owner_id), "Explain containers", scope="all"
        )
        assert any(item.get("note") and str(item["note"].id) == second_note for item in all_items)

        selected = await retrieval_service.retrieve_context(
            db, UUID(first), UUID(owner_id), "Summarize my selected notes",
            scope="all", note_ids=[UUID(first_note), UUID(second_note)],
        )
        assert {str(item["note"].id) for item in selected} == {first_note, second_note}
        with pytest.raises(HTTPException) as error:
            await retrieval_service.retrieve_context(
                db, UUID(first), UUID(owner_id), "Summarize this note",
                note_ids=[UUID(second_note)],
            )
        assert error.value.status_code == 404

    other_headers, _ = await registered_user(client, "other-rag@example.com", "Other Researcher")
    other_project = await project(client, other_headers, "Private notes")
    other_note = (await client.post(
        f"/api/v1/projects/{other_project}/notes", headers=other_headers,
        json={"title": "Private note", "content": "Hidden evidence"},
    )).json()["id"]
    conversation = await client.post(
        f"/api/v1/conversations/{first}", headers=headers,
        json={"title": "Scoped research"},
    )
    captured = {}
    async def generate(history, prompt, context):
        captured["context"] = context
        return "Containers share the host kernel and package applications."
    monkeypatch.setattr(ai_service.provider, "generate", generate)
    mixed_reply = await client.post(
        "/api/v1/ai/chat", headers=headers,
        json={"conversation_id": conversation.json()["id"], "message": "Explain containers"},
    )
    assert mixed_reply.status_code == 200, mixed_reply.text
    assert "Containers share the host kernel" in captured["context"]
    assert "Containers package applications" in captured["context"]
    assert {source["source_type"] for source in mixed_reply.json()["sources"]} == {"note", "document"}
    assert {source["note_id"] for source in mixed_reply.json()["sources"] if source["note_id"]} == {first_note}
    assert {source["document_id"] for source in mixed_reply.json()["sources"] if source["document_id"]} == {str(document.id)}
    assert all(source["excerpt"] in captured["context"] for source in mixed_reply.json()["sources"])
    forbidden = await client.post(
        "/api/v1/ai/chat", headers=headers,
        json={"conversation_id": conversation.json()["id"], "message": "Summarize selected note",
              "scope": "all", "note_ids": [other_note]},
    )
    assert forbidden.status_code == 404


async def test_empty_note_has_no_indexed_evidence(api, monkeypatch):
    client, sessions = api
    headers, owner_id = await registered_user(client, "empty-rag@example.com", "Empty Researcher")
    project_id = await project(client, headers, "Empty notes")
    response = await client.post(
        f"/api/v1/projects/{project_id}/notes", headers=headers,
        json={"title": "Untitled thoughts", "content": "<p></p>"},
    )
    assert response.status_code == 201, response.text
    async with sessions() as db:
        chunks = (await db.scalars(select(NoteChunk).where(NoteChunk.note_id == UUID(response.json()["id"])))).all()
        assert chunks == []
        results = await retrieval_service.retrieve_context(
            db, UUID(project_id), UUID(owner_id), "What is in my notes?"
        )
        assert results == []
    conversation = await client.post(
        f"/api/v1/conversations/{project_id}", headers=headers,
        json={"title": "Empty research"},
    )
    async def unexpected_generate(history, prompt, context):
        raise AssertionError("Provider must not invent an answer without evidence")
    monkeypatch.setattr(ai_service.provider, "generate", unexpected_generate)
    reply = await client.post(
        "/api/v1/ai/chat", headers=headers,
        json={"conversation_id": conversation.json()["id"], "message": "What is in my notes?"},
    )
    assert reply.status_code == 200, reply.text
    assert "couldn't find enough" in reply.json()["response"]
    assert reply.json()["sources"] == []


async def test_failed_reindex_keeps_previous_note_and_chunks(api, monkeypatch):
    client, sessions = api
    headers, _ = await registered_user(client, "failed-rag@example.com", "Failure Researcher")
    project_id = await project(client, headers, "Failure recovery")
    created = await client.post(
        f"/api/v1/projects/{project_id}/notes", headers=headers,
        json={"title": "Stable note", "content": "Original evidence"},
    )
    assert created.status_code == 201, created.text
    note_id = UUID(created.json()["id"])
    from src.notes.schema import NoteUpdate
    from src.notes.service import note_service

    def fail_embeddings(chunks):
        raise RuntimeError("embedding provider unavailable")

    monkeypatch.setattr(processing_service, "generate_embeddings", fail_embeddings)
    async with sessions() as db:
        with pytest.raises(RuntimeError, match="embedding provider unavailable"):
            await note_service.update_note(db, note_id, NoteUpdate(content="Unindexed new text"))
    fetched = await client.get(f"/api/v1/projects/notes/{note_id}", headers=headers)
    assert fetched.json()["content"] == "Original evidence"
    async with sessions() as db:
        chunks = (await db.scalars(select(NoteChunk).where(NoteChunk.note_id == note_id))).all()
        assert len(chunks) == 1
        assert "Original evidence" in chunks[0].content
