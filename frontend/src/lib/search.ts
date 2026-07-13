import api from "@/lib/api";
import { SearchResult } from "@/types";

export async function semanticSearch(
  query: string,
  filter?: string
): Promise<{ results: SearchResult[]; aiAnswer: string }> {
  const response = await api.post("/search", { query });
  
  const results = response.data.results.map((result: any) => ({
    id: result.id,
    type: result.type as "pdf" | "note" | "conversation",
    title: result.title,
    snippet: result.snippet,
    matchPercentage: result.score || 0,
    tags: result.tags,
    timestamp: result.created_at,
    projectId: result.project_id,
  }));

  const aiAnswer = response.data.ai_answer || "";

  return { results, aiAnswer };
}
