import api from "@/lib/api";
import { Project } from "@/types";

function mapProject(project: any): Project {
  return {
    id: project.id,
    name: project.name,
    description: project.description ?? "",
    color: project.color,
    updatedAt: project.updated_at,
    documentCount: project.document_count ?? 0,
    tags: [],
  };
}

export async function getProjects(): Promise<Project[]> {
  const response = await api.get("/projects/");
  return response.data.map(mapProject);
}

export async function getProject(id: string): Promise<Project> {
  const response = await api.get(`/projects/${id}`);
  return mapProject(response.data);
}

export async function createProject(data: {
  name: string;
  description: string;
  color: string;
}): Promise<Project> {
  const response = await api.post("/projects/", data);
  return mapProject(response.data);
}

export async function updateProject(
  id: string,
  data: {
    name?: string;
    description?: string;
    color?: string;
  }
): Promise<Project> {
  const response = await api.patch(`/projects/${id}`, data);
  return mapProject(response.data);
}

export async function deleteProject(id: string): Promise<void> {
  await api.delete(`/projects/${id}`);
}