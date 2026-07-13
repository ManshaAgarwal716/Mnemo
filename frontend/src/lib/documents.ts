import api from "@/lib/api";
import { Document } from "@/types";

export async function getDocuments(projectId: string): Promise<Document[]> {
  const response = await api.get(`/documents/project/${projectId}`);

  return response.data.map((doc: any) => ({
    id: doc.id,
    projectId: doc.project_id,
    title: doc.title,
    fileName: doc.file_name,
    filePath: `http://localhost:8000/${doc.file_path}`,
    fileType: doc.file_type.includes("pdf") ? "pdf" : "web",
    fileSize: doc.file_size,
    updatedAt: doc.updated_at,
  }));
}

export async function getDocument(id: string): Promise<Document> {
  const response = await api.get(`/documents/${id}`);

  const doc = response.data;

  return {
    id: doc.id,
    projectId: doc.project_id,
    title: doc.title,
    fileName: doc.file_name,
    filePath: `http://localhost:8000/${doc.file_path}`,
    fileType: doc.file_type.includes("pdf") ? "pdf" : "web",
    fileSize: doc.file_size,
    updatedAt: doc.updated_at,
  };
}

export async function uploadDocument(data: {
  projectId: string;
  name: string;
  file: File;
}): Promise<Document> {
  const formData = new FormData();

  formData.append("project_id", data.projectId);
  formData.append("title", data.name);
  formData.append("file", data.file);

  const response = await api.post(
    "/documents/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  const doc = response.data;

  return {
    id: doc.id,
    projectId: doc.project_id,
    title: doc.title,
    fileName: doc.file_name,
    fileType: doc.file_type.includes("pdf") ? "pdf" : "web",
    filePath: `http://localhost:8000/${doc.file_path}`,
    fileSize: doc.file_size,
    updatedAt: doc.updated_at,
  };
}

export async function renameDocument(
  id: string,
  title: string
): Promise<Document> {
  const response = await api.patch(`/documents/${id}`, {
    title,
  });

  const doc = response.data;

  return {
    id: doc.id,
    projectId: doc.project_id,
    title: doc.title,
    fileName: doc.file_name,
    filePath: `http://localhost:8000/${doc.file_path}`,
    fileType: doc.file_type.includes("pdf") ? "pdf" : "web",
    fileSize: doc.file_size,
    updatedAt: doc.updated_at,
  };
}

export async function deleteDocument(id: string): Promise<void> {
  await api.delete(`/documents/${id}`);
}

export function downloadDocument(
  filePath: string,
  fileName?: string
) {
  const link = document.createElement("a");

  link.href = filePath;
  link.download = fileName ?? "";

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);
}