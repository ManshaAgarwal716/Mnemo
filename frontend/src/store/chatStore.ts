import { create } from "zustand";

interface ChatState {
  activeConversationId: string | null;
  streamingText: string;
  isStreaming: boolean;
  setActiveConversation: (id: string | null) => void;
  setStreamingText: (text: string) => void;
  appendStreamingText: (chunk: string) => void;
  setIsStreaming: (isStreaming: boolean) => void;
  clearStreaming: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  activeConversationId: null,
  streamingText: "",
  isStreaming: false,

  setActiveConversation: (id) => set({ activeConversationId: id }),
  
  setStreamingText: (text) => set({ streamingText: text }),
  
  appendStreamingText: (chunk) =>
    set((state) => ({ streamingText: state.streamingText + chunk })),
  
  setIsStreaming: (isStreaming) => set({ isStreaming }),
  
  clearStreaming: () => set({ streamingText: "", isStreaming: false }),
}));
