"use client";

import { useQuery } from "@tanstack/react-query";
import { getConversations } from "@/lib/chat";
import { groupConversationsByDate, formatRelativeTime } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/Skeleton";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ConversationHistoryProps {
  activeConversationId: string | null;
  onConversationSelect: (id: string) => void;
  onNewConversation: () => void;
}

export function ConversationHistory({
  activeConversationId,
  onConversationSelect,
  onNewConversation,
}: ConversationHistoryProps) {
  const { data: conversations, isLoading } = useQuery({
    queryKey: ["conversations"],
    queryFn: getConversations,
  });

  if (isLoading) {
    return (
      <div className="p-4 space-y-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    );
  }

  const grouped = groupConversationsByDate(conversations || []);

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <Button
          onClick={onNewConversation}
          className="w-full justify-start"
          size="sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          New conversation
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {Object.entries(grouped).map(([group, convs]) => {
          if (convs.length === 0) return null;

          return (
            <div key={group} className="mb-6">
              <h3 className="text-xs font-medium text-gray-500 uppercase mb-2">
                {group}
              </h3>
              <div className="space-y-1">
                {convs.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => onConversationSelect(conv.id)}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded transition-colors",
                      activeConversationId === conv.id
                        ? "bg-primary-light text-primary"
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                  >
                    <p className="text-sm font-medium truncate mb-0.5">
                      {conv.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatRelativeTime(conv.updatedAt)}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
