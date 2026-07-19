import api from "@/lib/api";
import { Project } from "@/types";

export async function getProjects(): Promise<Project[]> {
  const response = await api.get("/projects/");
  return response.data;
}

export async function getProject(id: string): Promise<Project> {
  const response = await api.get(`/projects/${id}`);
  return response.data;
}

export async function createProject(data: {
  name: string;
  description: string;
  color: string;
}): Promise<Project> {
  const response = await api.post("/projects/", data);
  return response.data;
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
  return response.data;
}

export async function deleteProject(id: string): Promise<void> {
  await api.delete(`/projects/${id}`);
}