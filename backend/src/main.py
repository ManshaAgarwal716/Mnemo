from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.api.v1.auth import router as auth_router
from src.api.v1.projects import router as project_router
from src.api.v1.documents import router as document_router
from src.api.v1.conversations import router as conversation_router
from src.api.v1.messages import router as message_router
from src.api.v1.notes import router as note_router
from src.api.v1.ai import router as ai_router
from src.health.routes import router as health_router
from src.api.v1.search import router as search_router
from fastapi.staticfiles import StaticFiles
app = FastAPI(
    title="Mnemo API",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.include_router(auth_router,prefix="/api/v1",)
app.include_router(project_router,prefix="/api/v1",)
app.include_router(document_router,prefix="/api/v1",)
app.include_router(conversation_router,prefix="/api/v1",)
app.include_router(message_router,prefix="/api/v1",)
app.include_router(ai_router,prefix="/api/v1",)
app.include_router(note_router,prefix="/api/v1",)
app.include_router(search_router,prefix="/api/v1",)
app.include_router(health_router,prefix="/api/v1",)

@app.get("/")
def root():
    return {"message": "Mnemo API Running 🚀"}