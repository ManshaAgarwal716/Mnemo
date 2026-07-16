import api from "@/lib/api";
import { SearchResult } from "@/types";

export async function semanticSearch(
  query: string,
  filter: string,
) {
  const response = await api.post("/search", {
  query,
  filter,
});

  return {
    aiAnswer: response.data.ai_answer,
    results: response.data.results.map((result: any) => ({
      id: result.id,
      type: result.type,
      title: result.title,
      snippet: result.snippet,
      matchPercentage: Math.round(result.score),
      tags: result.tags,
      timestamp: result.created_at,
      projectId: result.project_id,
    })) as SearchResult[],
  };
}