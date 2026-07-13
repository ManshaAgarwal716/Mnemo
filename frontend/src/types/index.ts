export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  documentCount: number;
  updatedAt: string;
  tags?: string[];
}

export interface Document {
    id: string;
    projectId: string;
    title: string;
    fileName: string;
    filePath: string;
    fileType: "pdf" | "web";
    fileSize: number;
    updatedAt: string;
}

export interface Note {
  id: string;
  projectId: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface Source {
  documentId: string;
  documentName: string;
  page?: number;
  snippet?: string;
}

export interface MessageSource {
  document_id: string;
  title: string;
  file_name: string;
}

export interface Message {
  id: string;
  conversationId: string;
  role: "user" | "assistant";
  content: string;
  sources?: MessageSource[];
  timestamp: string;
}

export interface Conversation {
  id: string;
  projectId?: string;
  title: string;
  contextDocuments?: string[];
  memoryActive: boolean;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

export interface SearchResult {
  id: string;
  type: "pdf" | "note" | "conversation";
  title: string;
  snippet: string;
  matchPercentage: number;
  tags?: string[];
  timestamp: string;
  projectId?: string;
}

export interface Tab {
  id: string;
  type: "document" | "note";
  documentId: string;
  title: string;
  icon: "file-text" | "sticky-note" | "globe";
}

export interface ActivityItem {
  id: string;
  type: "document" | "note" | "conversation";
  name: string;
  subtitle: string;
  timestamp: string;
  icon: string;
}
