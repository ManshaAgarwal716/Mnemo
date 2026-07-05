from pydantic import BaseModel

from src.projects.schema import ProjectResponse
from src.documents.schema import DocumentResponse
from src.notes.schema import NoteResponse


class SearchRequest(BaseModel):
    query: str


class SearchResponse(BaseModel):
    projects: list[ProjectResponse]
    documents: list[DocumentResponse]
    notes: list[NoteResponse]