import { Project } from "@/types";
import { mockProjects } from "@/mock/projects";

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getProjects(): Promise<Project[]> {
  await delay(300);
  return mockProjects;
}

export async function getProject(id: string): Promise<Project> {
  await delay(200);
  const project = mockProjects.find((p) => p.id === id);
  if (!project) throw new Error("Project not found");
  return project;
}

export async function createProject(data: {
  name: string;
  description: string;
  color: string;
}): Promise<Project> {
  await delay(400);
  const newProject: Project = {
    id: `project-${Date.now()}`,
    ...data,
    documentCount: 0,
    updatedAt: new Date().toISOString(),
    tags: [],
  };
  mockProjects.push(newProject);
  return newProject;
}

export async function deleteProject(id: string): Promise<void> {
  await delay(300);
  const index = mockProjects.findIndex((p) => p.id === id);
  if (index !== -1) {
    mockProjects.splice(index, 1);
  }
}
