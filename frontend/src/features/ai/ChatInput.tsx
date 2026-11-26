"use client";

import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { useChatStore } from "@/store/chatStore";
import { useWorkspaceStore } from "@/store/workspaceStore";

interface ChatInputProps {
  conversationId: string;
}

export function ChatInput({ conversationId }: ChatInputProps) {
  const [input, setInput] = useState("");
  const [scope, setScope] = useState<"project" | "all">("project");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const queryClient = useQueryClient();
  const { tabs, activeTabId } = useWorkspaceStore();
  const activeTab = tabs.find((tab) => tab.id === activeTabId);

  const {
    setIsStreaming,
    setStreamingText,
    appendStreamingText,
    clearStreaming,
  } = useChatStore();

  const sendMutation = useMutation({
    mutationFn: async (message: string) => {
      setIsStreaming(true);
      setStreamingText("");

      const response = await api.post("/ai/chat", {
        conversation_id: conversationId,
        message,
        active_note_id: activeTab?.type === "note" ? activeTab.documentId : undefined,
        scope,
      });

      const aiResponse = response.data.response;
      const words = aiResponse.split(" ");

      for (const word of words) {
        await new Promise((resolve) => setTimeout(resolve, 25));
        appendStreamingText(word + " ");
      }

      return response.data;
    },

    onSuccess: () => {
      clearStreaming();

      queryClient.invalidateQueries({
        queryKey: ["messages", conversationId],
      });

      queryClient.invalidateQueries({
        queryKey: ["conversations"],
      });
    },

   onError: (error: any) => {
  clearStreaming();

  const message =
    error?.response?.data?.detail ??
    "AI is temporarily unavailable. Please try again later.";

  alert(message);
}
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || sendMutation.isPending) return;

    sendMutation.mutate(input);
    setInput("");
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-gray-200 p-3"
    >
      <div className="mb-2 flex items-center justify-between gap-2 text-xs text-gray-500">
        <span>{activeTab?.type === "note" ? `Open note: ${activeTab.title}` : "Ask across your knowledge"}</span>
        <select aria-label="AI knowledge scope" value={scope} onChange={(event) => setScope(event.target.value as "project" | "all")} className="rounded border border-gray-200 bg-white px-2 py-1 text-xs">
          <option value="project">This project</option>
          <option value="all">All projects</option>
        </select>
      </div>
      <div className="flex items-end gap-2">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          placeholder="Ask about your notes and documents..."
          rows={1}
          className="flex-1 max-h-32 resize-none rounded border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
          disabled={sendMutation.isPending}
        />

        <button
          type="submit"
          disabled={!input.trim() || sendMutation.isPending}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
}
