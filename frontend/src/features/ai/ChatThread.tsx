"use client";

import { useQuery } from "@tanstack/react-query";
import { getConversation } from "@/lib/chat";
import { MessageBubble } from "./MessageBubble";
import { Skeleton } from "@/components/ui/Skeleton";
import { Avatar } from "@/components/ui/Avatar";
import { useChatStore } from "@/store/chatStore";
import { useEffect, useRef } from "react";

interface ChatThreadProps {
  conversationId: string;
}

export function ChatThread({ conversationId }: ChatThreadProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { streamingText, isStreaming } = useChatStore();

  const { data: conversation, isLoading } = useQuery({
    queryKey: ["conversation", conversationId],
    queryFn: () => getConversation(conversationId),
    enabled: !!conversationId,
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [conversation?.messages, streamingText]);

  if (isLoading) {
    return (
      <div className="space-y-4 p-4">
        <Skeleton className="h-16 w-3/4" />
        <div className="flex justify-end">
          <Skeleton className="h-12 w-1/2" />
        </div>
        <Skeleton className="h-20 w-4/5" />
      </div>
    );
  }

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
      {conversation?.messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}

      {isStreaming && (
        <div className="flex items-start gap-2">
          <Avatar size="sm" alt="AI" fallback="AI" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium text-gray-700">Mnemo AI</span>
            </div>
            {streamingText ? (
              <div className="bg-gray-100 rounded-lg px-4 py-2.5 max-w-[85%]">
                <p className="text-sm text-gray-900 leading-relaxed">{streamingText}</p>
              </div>
            ) : (
              <div className="bg-gray-100 rounded-lg px-4 py-2.5">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
