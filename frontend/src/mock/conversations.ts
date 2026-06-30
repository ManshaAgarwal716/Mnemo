import { Conversation } from "@/types";

export const mockConversations: Conversation[] = [
  {
    id: "conv-1",
    projectId: "1",
    title: "How does self-attention work?",
    contextDocuments: ["doc-1", "doc-3"],
    memoryActive: true,
    messages: [
      {
        id: "msg-1",
        conversationId: "conv-1",
        role: "user",
        content: "Can you explain how self-attention works in transformers?",
        timestamp: "2026-06-20T10:30:00Z",
      },
      {
        id: "msg-2",
        conversationId: "conv-1",
        role: "assistant",
        content:
          "Self-attention is a mechanism that allows each position in a sequence to attend to all positions in the previous layer. In the transformer architecture, this is implemented using Query, Key, and Value matrices. Each token creates a query vector and compares it against all key vectors to determine attention weights, which are then used to create a weighted sum of value vectors.",
        sources: [
          {
            documentId: "doc-1",
            documentName: "Attention Is All You Need",
            page: 3,
            snippet: "An attention function can be described as mapping a query...",
          },
          {
            documentId: "doc-3",
            documentName: "My research notes on self-attention",
            snippet: "Self-attention mechanisms allow the model to weigh...",
          },
        ],
        timestamp: "2026-06-20T10:30:15Z",
      },
      {
        id: "msg-3",
        conversationId: "conv-1",
        role: "user",
        content: "What's the computational complexity?",
        timestamp: "2026-06-20T10:31:00Z",
      },
      {
        id: "msg-4",
        conversationId: "conv-1",
        role: "assistant",
        content:
          "The computational complexity of self-attention is O(n²·d), where n is the sequence length and d is the dimension. This quadratic complexity with respect to sequence length is one of the main limitations of transformer models for very long sequences.",
        sources: [
          {
            documentId: "doc-1",
            documentName: "Attention Is All You Need",
            page: 5,
            snippet: "The complexity per layer for self-attention...",
          },
        ],
        timestamp: "2026-06-20T10:31:10Z",
      },
    ],
    createdAt: "2026-06-20T10:30:00Z",
    updatedAt: "2026-06-20T10:31:10Z",
  },
  {
    id: "conv-2",
    projectId: "1",
    title: "Difference between GPT and BERT",
    contextDocuments: ["doc-2", "doc-4"],
    memoryActive: true,
    messages: [
      {
        id: "msg-5",
        conversationId: "conv-2",
        role: "user",
        content: "What's the key difference between GPT and BERT architectures?",
        timestamp: "2026-06-19T15:20:00Z",
      },
      {
        id: "msg-6",
        conversationId: "conv-2",
        role: "assistant",
        content:
          "The key difference is in their training objectives and attention masking. BERT uses bidirectional attention and is trained with masked language modeling, allowing it to see context from both directions. GPT uses unidirectional (left-to-right) attention and is trained with causal language modeling, predicting the next token.",
        sources: [
          {
            documentId: "doc-2",
            documentName: "BERT: Pre-training Deep Bidirectional Transformers",
            page: 2,
          },
          {
            documentId: "doc-4",
            documentName: "GPT-3: Language Models are Few-Shot Learners",
            page: 4,
          },
        ],
        timestamp: "2026-06-19T15:20:12Z",
      },
    ],
    createdAt: "2026-06-19T15:20:00Z",
    updatedAt: "2026-06-19T15:20:12Z",
  },
  {
    id: "conv-3",
    title: "General AI questions",
    memoryActive: false,
    messages: [
      {
        id: "msg-7",
        conversationId: "conv-3",
        role: "user",
        content: "What are the latest trends in AI research?",
        timestamp: "2026-06-18T14:10:00Z",
      },
      {
        id: "msg-8",
        conversationId: "conv-3",
        role: "assistant",
        content:
          "Current trends include multimodal models, efficient architectures for long contexts, better alignment techniques, and more capable reasoning systems.",
        timestamp: "2026-06-18T14:10:08Z",
      },
    ],
    createdAt: "2026-06-18T14:10:00Z",
    updatedAt: "2026-06-18T14:10:08Z",
  },
];
