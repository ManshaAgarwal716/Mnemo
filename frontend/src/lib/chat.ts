import { Conversation, Message } from "@/types";
import { mockConversations } from "@/mock/conversations";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getConversations(): Promise<Conversation[]> {
  await delay(300);
  return mockConversations;
}

export async function getConversation(id: string): Promise<Conversation> {
  await delay(200);
  const conv = mockConversations.find((c) => c.id === id);
  if (!conv) throw new Error("Conversation not found");
  return conv;
}

export async function createConversation(data: {
  projectId?: string;
  title: string;
}): Promise<Conversation> {
  await delay(300);
  const newConv: Conversation = {
    id: `conv-${Date.now()}`,
    projectId: data.projectId,
    title: data.title,
    memoryActive: true,
    messages: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  mockConversations.unshift(newConv);
  return newConv;
}

// Simulate streaming response
export async function streamChat(
  conversationId: string,
  message: string,
  onChunk: (chunk: string) => void
): Promise<Message> {
  await delay(400);

  const responses = [
    "Self-attention is a mechanism that allows each position in a sequence to attend to all positions in the previous layer of the network. ",
    "It works by computing three vectors for each input token: Query (Q), Key (K), and Value (V). ",
    "The attention score between two positions is computed as the dot product of the query vector from one position with the key vector from another position. ",
    "These scores are then normalized using softmax and used to compute a weighted sum of the value vectors. ",
    "This allows the model to dynamically focus on different parts of the input when processing each token.",
  ];

  const fullResponse = responses.join("");
  const words = fullResponse.split(" ");

  for (let i = 0; i < words.length; i++) {
    await delay(30);
    onChunk(words[i] + " ");
  }

  const newMessage: Message = {
    id: `msg-${Date.now()}`,
    conversationId,
    role: "assistant",
    content: fullResponse.trim(),
    sources: [
      {
        documentId: "doc-1",
        documentName: "Attention Is All You Need",
        page: 3,
      },
    ],
    timestamp: new Date().toISOString(),
  };

  const conv = mockConversations.find((c) => c.id === conversationId);
  if (conv) {
    conv.messages.push({
      id: `msg-user-${Date.now()}`,
      conversationId,
      role: "user",
      content: message,
      timestamp: new Date().toISOString(),
    });
    conv.messages.push(newMessage);
    conv.updatedAt = new Date().toISOString();
  }

  return newMessage;
}
