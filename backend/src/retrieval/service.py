from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from src.processing.service import processing_service
from src.retrieval.repository import retrieval_repository
from src.security.ownership import require_project
from src.notes.model import Note
from src.notes.indexing import index_note
from sqlalchemy import select
from fastapi import HTTPException
from src.security.ownership import require_note, require_document
from src.projects.model import Project


class RetrievalService:

    async def _index_existing_notes(self, db: AsyncSession, project_id: UUID | None, owner_id: UUID):
        # Older notes predate note_chunks. Index them on the first retrieval.
        statement = select(Note).join(Project, Note.project_id == Project.id).where(
            Project.owner_id == owner_id, Note.indexed_at.is_(None)
        )
        if project_id is not None:
            statement = statement.where(Note.project_id == project_id)
        rows = await db.scalars(statement)
        notes = rows.all()
        if notes:
            try:
                for note in notes:
                    await index_note(db, note)
                await db.commit()
            except Exception:
                await db.rollback()
                raise

    async def retrieve_note_chunks(
        self, db: AsyncSession, project_id: UUID, owner_id: UUID,
        question: str, query_embedding: list[float] | None = None,
    ):
        await require_project(db, project_id, owner_id)
        await self._index_existing_notes(db, project_id, owner_id)
        embedding = query_embedding or processing_service.generate_embedding(
            question, task_type="RETRIEVAL_QUERY"
        )
        rows = await retrieval_repository.semantic_note_search(
            db, project_id, owner_id, embedding
        )
        return [
            {"chunk": chunk, "note": note, "distance": distance,
             "similarity": max(0, round((1 - distance) * 100))}
            for chunk, note, distance in rows if distance is not None and distance <= 0.75
        ]

    async def retrieve_chunks(
        self,
        db: AsyncSession,
        project_id: UUID,
        owner_id: UUID,
        question: str,
    ):
        await require_project(db, project_id, owner_id)

        query_embedding = (
            processing_service.generate_embedding(
                question,
                task_type="RETRIEVAL_QUERY",
            )
        )

        rows = await retrieval_repository.semantic_search(
            db=db,
            project_id=project_id,
            owner_id=owner_id,
            query_embedding=query_embedding,
        )

        results = []

        for chunk, document, distance in rows:
            if distance is None or distance > 0.75:
                continue

            similarity = max(
                0,
                round((1 - distance) * 100)
            )

            results.append(
                {
                    "chunk": chunk,
                    "document": document,
                    "distance": distance,
                    "similarity": similarity,
                }
            )

        return results

    async def retrieve_context(
        self, db: AsyncSession, project_id: UUID, owner_id: UUID, question: str,
        limit: int = 16, scope: str = "project",
        note_ids: list[UUID] | None = None,
        document_ids: list[UUID] | None = None,
        active_note_id: UUID | None = None,
    ):
        await require_project(db, project_id, owner_id)
        search_project = None if scope == "all" else project_id
        note_ids = list(dict.fromkeys(note_ids or []))
        document_ids = list(dict.fromkeys(document_ids or []))
        for note_id in note_ids:
            note = await require_note(db, note_id, owner_id)
            if search_project and note.project_id != search_project:
                raise HTTPException(status_code=404, detail="Resource not found")
        for document_id in document_ids:
            document = await require_document(db, document_id, owner_id)
            if search_project and document.project_id != search_project:
                raise HTTPException(status_code=404, detail="Resource not found")

        lowered = question.casefold()
        mentions_notes = "note" in lowered
        mentions_documents = any(word in lowered for word in ("document", "paper", "pdf"))
        if note_ids or document_ids:
            note_only = bool(note_ids) and not document_ids
            document_only = bool(document_ids) and not note_ids
        else:
            note_only = mentions_notes and not mentions_documents
            document_only = mentions_documents and not mentions_notes
        broad_request = any(word in lowered for word in (
            "all", "every", "everything", "entire", "my notes", "project notes", "notes in this project",
        ))
        if "my notes on " in lowered:
            broad_request = False
        synthesis_request = any(word in lowered for word in (
            "summari", "summary", "compare", "revision", "study guide", "outline",
            "extract", "list", "key points", "flashcards", "quiz", "mcq", "formulas",
        ))
        if active_note_id and any(phrase in lowered for phrase in ("this note", "open note", "selected note")):
            note = await require_note(db, active_note_id, owner_id)
            if search_project and note.project_id != search_project:
                raise HTTPException(status_code=404, detail="Resource not found")
            note_ids = [active_note_id]
            note_only = True

        await self._index_existing_notes(db, search_project, owner_id)
        accessible_notes = await retrieval_repository.list_accessible_notes(db, search_project, owner_id)
        if not note_ids:
            title_matches = [note.id for note in accessible_notes if len(note.title) >= 3 and note.title.casefold() in lowered]
            if title_matches:
                note_ids = title_matches
                note_only = not mentions_documents

        explicit_notes = bool(note_ids)
        full_notes = synthesis_request and (explicit_notes or (broad_request and mentions_notes))
        if full_notes:
            note_rows = await retrieval_repository.list_note_chunks(
                db, search_project, owner_id, note_ids or None, limit=60,
            )
            notes = [
                {"kind": "note", "chunk": chunk, "note": note, "distance": 0.0}
                for chunk, note in note_rows
            ]
        else:
            notes = []

        needs_semantic_notes = not notes and not document_only
        needs_semantic_documents = not note_only
        if needs_semantic_notes or needs_semantic_documents:
            embedding = processing_service.generate_embedding(question, task_type="RETRIEVAL_QUERY")
            if needs_semantic_notes:
                note_rows = await retrieval_repository.semantic_note_search(
                    db, search_project, owner_id, embedding, note_ids=note_ids or None,
                )
                notes = [
                    {"kind": "note", "chunk": chunk, "note": note, "distance": distance}
                    for chunk, note, distance in note_rows if distance is not None and (explicit_notes or distance <= 0.75)
                ]
            documents = []
            if needs_semantic_documents:
                document_rows = await retrieval_repository.semantic_search(
                    db, search_project, owner_id, embedding, document_ids=document_ids or None,
                )
                documents = [
                    {"kind": "document", "chunk": chunk, "document": document, "distance": distance}
                    for chunk, document, distance in document_rows if distance is not None and (document_ids or distance <= 0.75)
                ]
        else:
            documents = []

        if full_notes:
            combined = notes + documents
        else:
            combined = sorted(notes + documents, key=lambda item: item["distance"])
        seen = set()
        results = []
        source_counts = {}
        for item in combined:
            source = item.get("note") or item.get("document")
            key = (item["kind"], source.id, item["chunk"].id)
            source_key = (item["kind"], source.id)
            if key in seen or source_counts.get(source_key, 0) >= (60 if full_notes else 4):
                continue
            seen.add(key)
            source_counts[source_key] = source_counts.get(source_key, 0) + 1
            results.append(item)
            if len(results) >= limit and not full_notes:
                break
        return results[:60] if full_notes else results


retrieval_service = RetrievalService()
