"use client";

import { useParams } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { ConversationHistory } from "@/features/ai/ConversationHistory";
import { AiPanel } from "@/features/ai/AiPanel";

import { Badge } from "@/components/ui/Badge";

import { createConversation } from "@/lib/chat";
import { useWorkspaceStore } from "@/store/workspaceStore";

export default function AiPage() {
  const params = useParams();
  const projectId = params.projectId as string;

  const {
    activeConversationId,
    setActiveConversation,
  } = useWorkspaceStore();

  const queryClient = useQueryClient();

  const createConvMutation = useMutation({
    mutationFn: () =>
      createConversation({
        projectId,
        title: "New conversation",
      }),

    onSuccess: (conversation) => {
      setActiveConversation(conversation.id);

      queryClient.invalidateQueries({
        queryKey: ["conversations", projectId],
      });
    },
  });

  return (
    <div className="flex h-full overflow-hidden bg-gray-50">
      <div className="w-[260px] shrink-0 border-r border-gray-200 bg-white">
        <ConversationHistory
          projectId={projectId}
          activeConversationId={activeConversationId}
          onConversationSelect={setActiveConversation}
          onNewConversation={() => createConvMutation.mutate()}
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="border-b border-gray-200 bg-white px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                AI Assistant
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Chat with your documents and research.
              </p>
            </div>

            <Badge
              variant="teal"
              size="sm"
            >
              Memory Active
            </Badge>
          </div>
        </div>

        <div className="flex min-h-0 flex-1">
          {activeConversationId ? (
            <AiPanel
              conversationId={activeConversationId}
              mode="full"
            />
          ) : (
            <div className="flex flex-1 items-center justify-center bg-white">
              <div className="text-center">
                <h2 className="mb-2 text-xl font-semibold text-gray-800">
                  Welcome to Mnemo AI
                </h2>

                <p className="text-gray-500">
                  Select a conversation or create a new one to start chatting.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}