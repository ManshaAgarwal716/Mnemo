import { SearchResult } from "@/types";
import { mockSearchResults } from "@/mock/searchResults";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function semanticSearch(
  query: string,
  filter?: string
): Promise<{ results: SearchResult[]; aiAnswer: string }> {
  await delay(500);

  let results = [...mockSearchResults];

  if (filter && filter !== "all") {
    if (filter === "pdfs") {
      results = results.filter((r) => r.type === "pdf");
    } else if (filter === "notes") {
      results = results.filter((r) => r.type === "note");
    } else if (filter === "conversations") {
      results = results.filter((r) => r.type === "conversation");
    } else {
      // Assume it's a project ID
      results = results.filter((r) => r.projectId === filter);
    }
  }

  const aiAnswer = `Based on your documents, ${query.toLowerCase()} refers to a mechanism in neural networks that allows models to dynamically weight the importance of different input elements. This is particularly prominent in transformer architectures where self-attention enables each position to attend to all other positions in the sequence.`;

  return { results, aiAnswer };
}
