"use client";

import { Message } from "@/types";
import { Avatar } from "@/components/ui/Avatar";
import { SourceChips } from "./SourceChips";
import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="bg-primary text-white rounded-lg px-4 py-2.5 max-w-[85%]">
          <p className="text-sm">{message.content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2">
      <Avatar size="sm" alt="AI" fallback="AI" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-medium text-gray-700">Mnemo AI</span>
        </div>
        <div className="bg-gray-100 rounded-lg px-4 py-2.5 max-w-[85%]">
          <p className="text-sm text-gray-900 leading-relaxed">{message.content}</p>
        </div>
        {message.sources && message.sources.length > 0 && (
          <div className="mt-2">
            <SourceChips sources={message.sources} />
          </div>
        )}
      </div>
    </div>
  );
}
