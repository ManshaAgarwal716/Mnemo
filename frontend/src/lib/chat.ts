import api from "@/lib/api";
import { Conversation, Message } from "@/types";

export async function getConversations(projectId: string): Promise<Conversation[]> {
  const response = await api.get(`/conversations/project/${projectId}`);
  return response.data.map((conv: any) => ({
    id: conv.id,
    projectId: conv.project_id,
    title: conv.title,
    contextDocuments: conv.context_documents || [],
    memoryActive: conv.memory_active ?? true,
    messages: [],
    createdAt: conv.created_at,
    updatedAt: conv.updated_at,
  }));
}

export async function getConversation(id: string): Promise<Conversation> {
  const response = await api.get(`/conversations/${id}`);
  const conv = response.data;
  return {
    id: conv.id,
    projectId: conv.project_id,
    title: conv.title,
    contextDocuments: conv.context_documents || [],
    memoryActive: conv.memory_active ?? true,
    messages: [],
    createdAt: conv.created_at,
    updatedAt: conv.updated_at,
  };
}

export async function createConversation(data: {
  projectId: string;
  title: string;
}): Promise<Conversation> {
  const response = await api.post(`/conversations/${data.projectId}`, {
    title: data.title,
  });
  const conv = response.data;
  return {
    id: conv.id,
    projectId: conv.project_id,
    title: conv.title,
    contextDocuments: conv.context_documents || [],
    memoryActive: conv.memory_active ?? true,
    messages: [],
    createdAt: conv.created_at,
    updatedAt: conv.updated_at,
  };
}

export async function updateConversation(
  id: string,
  data: { title?: string }
): Promise<Conversation> {
  const response = await api.patch(`/conversations/${id}`, data);
  const conv = response.data;
  return {
    id: conv.id,
    projectId: conv.project_id,
    title: conv.title,
    contextDocuments: conv.context_documents || [],
    memoryActive: conv.memory_active ?? true,
    messages: [],
    createdAt: conv.created_at,
    updatedAt: conv.updated_at,
  };
}

export async function deleteConversation(id: string): Promise<void> {
  await api.delete(`/conversations/${id}`);
}
