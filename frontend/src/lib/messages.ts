import api from "@/lib/api";
import { Message } from "@/types";

export async function getMessages(conversationId: string): Promise<Message[]> {
  const response = await api.get(`/messages/conversation/${conversationId}`);
  return response.data.map((msg: any) => ({
    id: msg.id,
    conversationId: msg.conversation_id,
    role: msg.role,
    content: msg.content,
    sources: msg.sources,
    timestamp: msg.created_at,
  }));
}

export async function createMessage(
  conversationId: string,
  content: string,
  role: "user" | "assistant"
): Promise<Message> {
  const response = await api.post(`/messages/${conversationId}`, {
    content,
    role,
  });
  const msg = response.data;
  return {
    id: msg.id,
    conversationId: msg.conversation_id,
    role: msg.role,
    content: msg.content,
    sources: msg.sources,
    timestamp: msg.created_at,
  };
}
