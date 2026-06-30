import { Project } from "@/types";

export const mockProjects: Project[] = [
  {
    id: "1",
    name: "Transformer architecture research",
    description: "Deep dive into attention mechanisms and modern LLM architectures",
    color: "#7F77DD",
    documentCount: 12,
    updatedAt: "2026-06-19T14:30:00Z",
    tags: ["AI", "Research"],
  },
  {
    id: "2",
    name: "Quantum computing basics",
    description: "Foundational papers on quantum algorithms and error correction",
    color: "#1D9E75",
    documentCount: 8,
    updatedAt: "2026-06-18T09:15:00Z",
    tags: ["Physics", "Computing"],
  },
  {
    id: "3",
    name: "Climate policy analysis",
    description: "Policy documents and research on carbon reduction strategies",
    color: "#BA7517",
    documentCount: 15,
    updatedAt: "2026-06-17T16:45:00Z",
    tags: ["Policy", "Environment"],
  },
  {
    id: "4",
    name: "Product strategy notes",
    description: "Market research and competitive analysis for new product launch",
    color: "#DC2626",
    documentCount: 6,
    updatedAt: "2026-06-15T11:20:00Z",
    tags: ["Business"],
  },
];
