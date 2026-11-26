from html.parser import HTMLParser
from datetime import datetime

from sqlalchemy import delete
from sqlalchemy.ext.asyncio import AsyncSession

from src.notes.chunk import NoteChunk
from src.notes.model import Note
from src.processing.service import processing_service


class _TextExtractor(HTMLParser):
    def __init__(self):
        super().__init__()
        self.parts: list[str] = []
        self.ignored = 0

    def handle_data(self, data: str):
        if not self.ignored:
            self.parts.append(data)

    def handle_starttag(self, tag: str, attrs):
        if tag in {"script", "style"}:
            self.ignored += 1
        if tag in {"p", "div", "li", "br", "h1", "h2", "h3"}:
            self.parts.append(" ")

    def handle_endtag(self, tag: str):
        if tag in {"script", "style"} and self.ignored:
            self.ignored -= 1


def note_text(note: Note) -> str:
    parser = _TextExtractor()
    parser.feed(note.content or "")
    content = " ".join(parser.parts).strip()
    return f"{note.title}\n{content}" if content else ""


async def index_note(db: AsyncSession, note: Note) -> None:
    chunks = processing_service.chunk_text(note_text(note))
    embeddings = processing_service.generate_embeddings(chunks)
    if len(chunks) != len(embeddings):
        raise ValueError("Note processing returned incomplete embeddings")

    await db.execute(delete(NoteChunk).where(NoteChunk.note_id == note.id))
    for index, (content, embedding) in enumerate(zip(chunks, embeddings)):
        db.add(NoteChunk(note_id=note.id, chunk_index=index, content=content, embedding=embedding))
    note.indexed_at = datetime.utcnow()
