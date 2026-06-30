import { Document } from "@/types";
import { mockDocuments } from "@/mock/documents";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getDocuments(projectId: string): Promise<Document[]> {
  await delay(250);
  return mockDocuments.filter((doc) => doc.projectId === projectId);
}

export async function getDocument(id: string): Promise<Document> {
  await delay(200);
  const doc = mockDocuments.find((d) => d.id === id);
  if (!doc) throw new Error("Document not found");
  return doc;
}

export async function uploadDocument(data: {
  projectId: string;
  name: string;
  type: "pdf" | "note" | "web";
  file?: File;
}): Promise<Document> {
  await delay(800);
  const newDoc: Document = {
    id: `doc-${Date.now()}`,
    projectId: data.projectId,
    name: data.name,
    type: data.type,
    updatedAt: new Date().toISOString(),
    pageCount: data.type === "pdf" ? 10 : undefined,
  };
  mockDocuments.push(newDoc);
  return newDoc;
}

export async function deleteDocument(id: string): Promise<void> {
  await delay(300);
  const index = mockDocuments.findIndex((d) => d.id === id);
  if (index !== -1) {
    mockDocuments.splice(index, 1);
  }
}
