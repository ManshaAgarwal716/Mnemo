# Mnemo

> An AI-native research workspace that helps you organize documents, take notes, and interact with your research through intelligent conversations.

Mnemo is a full-stack research platform built to simplify the way students, researchers, and developers work with technical documents.

Instead of switching between a PDF reader, a note-taking application, and an AI chatbot, Mnemo brings everything together into one workspace where research becomes organized, interactive, and conversational.

---

## Features

### Project-Based Organization

Create independent research projects where every project maintains its own:

- Documents
- Notes
- AI conversations
- Workspace state

This keeps different research topics completely isolated.

---

### PDF Workspace

Upload and read PDF documents directly inside the application.

Features include:

- PDF upload
- Built-in PDF viewer
- Multiple document tabs
- Quick document switching

---

### Rich Text Notes

Create notes while reading documents.

Supports:

- Headings
- Lists
- Rich text formatting
- Organized project notes

Notes remain attached to their respective project for easy reference.

---

### AI Assistant

Each project includes an AI assistant capable of answering questions using uploaded documents as context.

Example prompts:

- Summarize this paper.
- Explain this algorithm.
- What are the key findings?
- Compare these two documents.

Every conversation is automatically saved, allowing users to continue discussions later without losing context.

---

### Conversation Management

Users can:

- Create conversations
- Rename conversations
- Delete conversations
- Clear conversation history
- Resume previous discussions

---

### Modern Workspace

The interface is designed around a three-panel workflow.

- Project Sidebar
- Document / Note Workspace
- AI Assistant

This enables users to read, write, and interact with AI simultaneously.

---

## AI Workflow

Mnemo currently uses Retrieval-Augmented Generation (RAG) over uploaded PDF documents.

The workflow is:

1. User uploads a PDF.
2. Document text is extracted and processed.
3. Relevant document chunks are retrieved based on the user's question.
4. Retrieved context is sent to the language model.
5. The AI generates a context-aware response.
6. Source documents are displayed alongside the response.

Project notes are currently managed independently and are **not yet part of the retrieval pipeline**. This decision keeps responses grounded in uploaded source documents while the note retrieval pipeline is being developed.

---

## How It Works

### 1. Create a Project

Every project acts as an independent research workspace.

```
Project
│
├── Documents
├── Notes
├── Conversations
└── Workspace
```

---

### 2. Upload Documents

Upload one or more PDF files.

The backend processes the document so it can later be used during AI conversations.

---

### 3. Read and Organize

Open documents inside the workspace and create notes alongside them.

---

### 4. Chat with AI

Ask questions in natural language.

Examples:

```
Summarize this paper.

Explain this section.

What problem does this research solve?

Compare these findings with another paper.
```

---

### 5. Continue Research

All conversations remain attached to the project, allowing users to return later and continue their research seamlessly.

---

## Tech Stack

### Frontend

- Next.js 14
- React
- TypeScript
- Tailwind CSS
- TanStack Query
- Zustand
- TipTap Editor
- React PDF
- Axios

### Backend

- FastAPI
- PostgreSQL
- SQLModel
- Alembic
- JWT Authentication

### AI
- Groq

### Storage
- Supabase Storage

---


## Getting Started

### Clone the Repository

```bash
git clone https://github.com/your-username/mnemo.git

cd mnemo
```

---

## Frontend

```bash
cd frontend

npm install

npm run dev
```

---

## Backend

```bash
cd backend

python -m venv .venv

source .venv/bin/activate

pip install -r requirements.txt

alembic upgrade head

uvicorn src.main:app --reload
```

---

## Running with Docker

Build and start all services.

```bash
docker compose up --build
```

To stop the application:

```bash
docker compose down
```

---

## Environment Variables

### Frontend

```env
NEXT_PUBLIC_API_URL=

NEXT_PUBLIC_GOOGLE_CLIENT_ID=
```

### Backend

```env
DATABASE_URL=

SYNC_DATABASE_URL=

JWT_SECRET=

GOOGLE_CLIENT_ID=

GEMINI_API_KEY=

GROQ_API_KEY=

SUPABASE_URL=

SUPABASE_SERVICE_KEY=
```

---

## Future Improvements

- Semantic note retrieval
- Unified document and note context
- Citation-aware AI responses
- Multi-document reasoning
- Workspace sharing
- AI-generated flashcards
- Document annotations
- Knowledge graph visualization
- Full-text semantic search

---

## Why Mnemo?

Modern research requires reading, organizing, and understanding large amounts of information.

Mnemo reduces context switching by combining document management, note-taking, and AI-powered conversations into a single workspace, enabling users to focus on learning instead of managing multiple tools.

---

## License

This project is licensed under the MIT License.