import { SearchResult } from "@/types";

export const mockSearchResults: SearchResult[] = [
  {
    id: "result-1",
    type: "pdf",
    title: "Attention Is All You Need",
    snippet:
      "The dominant sequence transduction models are based on complex recurrent or convolutional neural networks. We propose a new simple network architecture, the **Transformer**, based solely on **attention mechanisms**.",
    matchPercentage: 94,
    tags: ["Transformers", "NLP"],
    timestamp: "2026-06-19T14:30:00Z",
    projectId: "1",
  },
  {
    id: "result-2",
    type: "note",
    title: "My research notes on self-attention",
    snippet:
      "**Self-attention mechanisms** allow the model to weigh the importance of different parts of the input when processing each element. This is fundamentally different from RNNs which process sequentially.",
    matchPercentage: 89,
    timestamp: "2026-06-18T16:20:00Z",
    projectId: "1",
  },
  {
    id: "result-3",
    type: "conversation",
    title: "How does self-attention work?",
    snippet:
      "Self-attention is a mechanism that allows each position in a sequence to attend to all positions... implemented using Query, Key, and Value matrices.",
    matchPercentage: 87,
    timestamp: "2026-06-20T10:31:10Z",
    projectId: "1",
  },
  {
    id: "result-4",
    type: "pdf",
    title: "BERT: Pre-training Deep Bidirectional Transformers",
    snippet:
      "BERT is designed to pretrain deep bidirectional representations by jointly conditioning on both left and right context using a masked language model objective.",
    matchPercentage: 76,
    tags: ["BERT", "NLP"],
    timestamp: "2026-06-19T12:15:00Z",
    projectId: "1",
  },
];
