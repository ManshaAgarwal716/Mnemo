from fastapi import FastAPI

from src.api.v1.auth import router as auth_router
from src.api.v1.projects import router as project_router
from src.api.v1.documents import router as document_router
from src.api.v1.conversations import router as conversation_router
from src.api.v1.messages import router as message_router
from src.api.v1.notes import router as note_router

app = FastAPI(
    title="Mnemo API",
)

app.include_router(auth_router)
app.include_router(project_router)
app.include_router(document_router)
app.include_router(conversation_router)
app.include_router(message_router)
app.include_router(note_router)


@app.get("/")
def root():
    return {"message": "Mnemo API Running 🚀"}