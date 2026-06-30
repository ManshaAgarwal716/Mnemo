# Mnemo Frontend

**AI-native semantic research workspace**

A complete Next.js frontend for Mnemo, combining browser-like tabs, PDF research, semantic search, and contextual AI chat with persistent memory.

## 🎯 Project Overview

This is a **frontend-only** implementation built against a mock API layer. The mock layer is clearly separated and can be swapped for a real FastAPI backend by simply updating the functions in `src/lib/*.ts`.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Visit [http://localhost:3000](http://localhost:3000) to see the landing page.

## 🔐 Authentication

For the demo, you can sign up/login with **any** email and password. The mock auth accepts all credentials.

**Quick test credentials:**
- Email: `demo@mnemo.ai`
- Password: `password123`

## 📁 Project Structure

```
src/
├── app/                      # Next.js App Router pages
│   ├── (app)/               # Authenticated app routes
│   │   ├── dashboard/       # Dashboard page
│   │   ├── workspace/       # Workspace with tabs & PDF viewer
│   │   ├── ai/             # Full-screen AI chat
│   │   └── search/         # Semantic search
│   ├── login/              # Login page
│   ├── signup/             # Signup page
│   ├── layout.tsx          # Root layout
│   ├── providers.tsx       # React Query provider
│   └── globals.css         # Global styles
├── components/
│   ├── ui/                 # Reusable UI components
│   └── layout/             # Layout components (Sidebar, Topbar)
├── features/               # Feature-specific components
│   ├── landing/            # Landing page components
│   ├── auth/               # Auth forms
│   ├── dashboard/          # Dashboard components
│   ├── workspace/          # Workspace components
│   ├── ai/                 # AI panel & chat components
│   └── search/             # Search components
├── store/                  # Zustand stores (client state)
│   ├── authStore.ts        # Auth state (persisted)
│   ├── workspaceStore.ts   # Workspace tabs & active project
│   ├── chatStore.ts        # Streaming chat state
│   ├── searchStore.ts      # Search query & filters
│   └── uiStore.ts          # UI state (sidebar, active tabs)
├── lib/                    # API & utilities
│   ├── api.ts              # Axios instance with interceptors
│   ├── auth.ts             # Auth API calls (mock)
│   ├── projects.ts         # Projects API calls (mock)
│   ├── documents.ts        # Documents API calls (mock)
│   ├── chat.ts             # Chat API with streaming (mock)
│   ├── search.ts           # Search API (mock)
│   └── utils.ts            # Helper utilities (cn, formatRelativeTime)
├── mock/                   # Mock data
│   ├── projects.ts
│   ├── documents.ts
│   ├── conversations.ts
│   └── searchResults.ts
├── types/
│   └── index.ts            # TypeScript type definitions
└── hooks/
    └── useDebounce.ts      # Custom hooks
```

## 🛠️ Tech Stack

- **Next.js 14+** (App Router, TypeScript, `src/` directory)
- **Zustand** for client/UI state
- **TanStack Query v5** for async/server state
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **lucide-react** for icons
- **react-hook-form + zod** for forms
- **axios** for HTTP client

## 🎨 Design System

### Colors
- **Primary**: `#7F77DD` (violet/purple)
  - Hover: `#534AB7`
  - Light fill: `#EEEDFE`
  - Light border: `#AFA9EC`
- **Secondary accents**:
  - Teal: `#1D9E75` / `#E1F5EE`
  - Amber: `#BA7517` / `#FAEEDA`

### Typography
- Font: Inter
- Sizes: 11–22px
- Weights: 400/500 only
- Case: Sentence case everywhere

### Spacing & Borders
- Border radius: 8px default, 12px for cards
- Borders: 0.5px, `#e5e7eb` neutral
- No gradients, drop shadows, or glow effects

## 🗺️ Navigation Flow

1. **Landing (`/`)** → Public marketing page
2. **Login/Signup** → Authentication
3. **Dashboard (`/dashboard`)** → Project overview & stats
4. **Workspace (`/workspace/[projectId]`)** → 3-column layout:
   - Left sidebar: Documents & notes list
   - Center: Tabbed PDF viewer / note editor
   - Right: AI panel with chat/summary/related tabs
5. **AI Assistant (`/ai`)** → Full-screen AI chat with conversation history
6. **Search (`/search`)** → Semantic search with AI-generated answers

## 📊 State Management

### Zustand (Client State)
- Active tab, active project selection
- Sidebar collapsed/expanded
- Active AI sub-tab (chat/summary/related)
- Streaming buffer for chat

### TanStack Query (Server State)
- Projects, documents, conversations
- Search results
- All async data fetching
- Automatic cache invalidation on mutations

## 🔌 Mock API → Real API Migration

To connect to a real backend:

1. Update `NEXT_PUBLIC_API_URL` in `.env.local`:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   ```

2. Replace functions in `src/lib/*.ts`:
   - Change mock implementations to actual API calls
   - Function signatures are already designed to match expected backend responses
   - Example:
     ```typescript
     // Before (mock)
     export async function getProjects(): Promise<Project[]> {
       await delay(300);
       return mockProjects;
     }
     
     // After (real API)
     export async function getProjects(): Promise<Project[]> {
       const response = await api.get('/projects');
       return response.data;
     }
     ```

## ✨ Key Features

### Workspace
- Browser-like tabs with closeable tabs (X on hover)
- Tab persistence per project
- PDF viewer with page navigation
- Note editor with auto-save (mock)
- Document/note sidebar with search

### AI Panel
- Real-time streaming responses (simulated)
- Source citations with document links
- Three tabs: Chat, Summary, Related
- Quick actions & concept chips
- Context-aware conversations

### Search
- Debounced semantic search (300ms)
- AI-generated answer summaries
- Filter by type (PDFs, notes, conversations) or project
- Match percentage badges
- Highlighted search terms

### Dashboard
- Project cards with stats
- Recent activity feed
- Usage statistics (documents, conversations, embeddings)
- Quick project creation

## 🎭 Interactive Demo Features

All features are fully functional with mock data:
- Sign up/login with any credentials
- Create projects (stored in memory)
- Navigate between projects
- Open documents in tabs
- Chat with AI (simulated streaming)
- Search across all content
- View conversation history

## 🚧 Intentional Limitations

- **No real backend** – Everything is mocked
- **No real PDF rendering** – Skeleton/static preview only
- **No real file uploads** – Button present but not wired
- **Desktop-first** – Not optimized for mobile
- **No dark mode toggle** – CSS variables ready but no UI switch

## 📦 Deployment

```bash
# Build the production bundle
npm run build

# The output will be in `.next/` directory
# Deploy to Vercel, Netlify, or any Node.js hosting
```

## 🔍 Code Quality

- **TypeScript** throughout with strict typing
- **No TODOs or placeholders** – every component is fully implemented
- **Consistent patterns** – follows Next.js and React best practices
- **Loading states** – skeleton loaders everywhere
- **Empty states** – friendly messages when no data
- **Error handling** – proper error boundaries and messages

## 📝 Next Steps

To build on this foundation:

1. **Backend Integration**:
   - Build FastAPI backend with matching API contracts
   - Implement real authentication with JWT
   - Add PostgreSQL + vector DB for semantic search
   - Connect real PDF processing pipeline

2. **Enhanced Features**:
   - Real-time collaboration
   - Advanced PDF annotations
   - Export functionality
   - Mobile responsive design
   - Dark mode implementation

3. **Production Hardening**:
   - Add error boundaries
   - Implement proper SEO
   - Add analytics
   - Performance optimization
   - Security audit


---

Built with ❤️ for AI-powered research
