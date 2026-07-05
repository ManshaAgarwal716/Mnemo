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

----------------------------
Phase 1 -> 
monorepo -> ready
ghealth endpoint --> fastAPI backend
basic JWT --> signup and login (postgres)

Phase 2-> 
nextJS fe (UI) + tailwind
tabspace UI
zustand store  for global state
tanstack query -> connect fe and core

STudy your code

WEDNESDAY


feature/login-JWT
fix/
refactor/

feature: ufbrihjbk kjebfh kbdeh iijbefch
fix: 
refctor: 



