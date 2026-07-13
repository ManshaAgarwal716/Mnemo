import api from "@/lib/api";
import { Note } from "@/types";

export async function getNotes(projectId: string): Promise<Note[]> {
  const response = await api.get(`/projects/${projectId}/notes`);

  return response.data.map((note: any) => ({
    id: note.id,
    projectId: note.project_id,
    title: note.title,
    content: note.content,
    updatedAt: note.updated_at,
  }));
}

export async function getNote(id: string): Promise<Note> {
  const response = await api.get(`/projects/notes/${id}`);

  const note = response.data;

  return {
    id: note.id,
    projectId: note.project_id,
    title: note.title,
    content: note.content,
    updatedAt: note.updated_at,
    createdAt: note.created_at,
  };
}

export async function createNote(
  projectId: string,
  data: {
    title: string;
    content: string;
  }
): Promise<Note> {
  const response = await api.post(
    `/projects/${projectId}/notes`,
    data
  );

  const note = response.data;

  return {
    id: note.id,
    projectId: note.project_id,
    title: note.title,
    content: note.content,
    updatedAt: note.updated_at,
    createdAt: note.created_at,
  };
}

export async function updateNote(
  id: string,
  data: {
    title?: string;
    content?: string;
  }
): Promise<Note> {
  const response = await api.patch(
    `/projects/notes/${id}`,
    data
  );

  const note = response.data;

  return {
    id: note.id,
    projectId: note.project_id,
    title: note.title,
    content: note.content,
    createdAt: note.created_at,
    updatedAt: note.updated_at,
  };
}

export async function deleteNote(id: string): Promise<void> {
  await api.delete(`/projects/notes/${id}`);
}
