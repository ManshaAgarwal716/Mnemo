# Mnemo ⚡

AI-native research browser with semantic memory, contextual AI, and intelligent knowledge retrieval.

Mnemo transforms browsing into a persistent AI-powered research workspace.

---

## Features

- AI-powered browser workspace
- Semantic browser history
- Cross-tab AI reasoning
- PDF + document intelligence
- Persistent AI memory
- Streaming AI chat
- Workspace projects
- Semantic search with pgvector

---

## Tech Stack

### Frontend
- Next.js
- React
- Tailwind CSS
- Zustand

### Desktop
- Tauri

### Backend
- FastAPI
- PostgreSQL
- SQLModel

### AI
- LangChain
- OpenAI APIs
- pgvector
- PyMuPDF

### DevOps
- Docker
- GitHub Actions
- Vercel
- Railway

---

## Architecture

```txt
Tauri Desktop App
        ↓
Next.js Frontend
        ↓
FastAPI Backend
        ↓
PostgreSQL + pgvector
        ↓
OpenAI APIs
