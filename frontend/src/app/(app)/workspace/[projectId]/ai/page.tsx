"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { ConversationHistory } from "@/features/ai/ConversationHistory";
import { ChatThread } from "@/features/ai/ChatThread";
import { ChatInput } from "@/features/ai/ChatInput";
import { ConceptChips } from "@/features/ai/ConceptChips";
import { QuickActions } from "@/features/ai/QuickActions";
import { Badge } from "@/components/ui/Badge";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createConversation } from "@/lib/chat";
import { useWorkspaceStore } from "@/store/workspaceStore";

export default function AiPage() {
  const params = useParams();
  console.log("params =", params);
  const projectId = params.projectId as string;
 const {
  activeConversationId,
  setActiveConversation,
} = useWorkspaceStore();
  const queryClient = useQueryClient();

  const createConvMutation = useMutation({
    mutationFn: () => createConversation({ projectId, title: "New conversation" }),
   onSuccess: (newConv) => {
  setActiveConversation(newConv.id);

  queryClient.invalidateQueries({
    queryKey: ["conversations", projectId],
  });
},
  });

  return (
    <div className="flex h-full">
      <div className="w-[220px] border-r border-gray-200 bg-white">
        <ConversationHistory
          projectId={projectId}
          activeConversationId={activeConversationId}
          onConversationSelect={setActiveConversation}
          onNewConversation={() => createConvMutation.mutate()}
        />
      </div>

      <div className="flex-1 flex flex-col">
        <div className="px-6 py-4 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-medium text-gray-900">
              AI Assistant
            </h1>
            <div className="flex items-center gap-2">
              <Badge variant="teal" size="sm">
                Memory active
              </Badge>
            </div>
          </div>
        </div>

        {activeConversationId ? (
          <>
            <ChatThread conversationId={activeConversationId} />
            <ConceptChips />
            <QuickActions />
            <ChatInput conversationId={activeConversationId} />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a conversation or start a new one
          </div>
        )}
      </div>
    </div>
  );
}
