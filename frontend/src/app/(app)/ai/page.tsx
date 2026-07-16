"use client";

import { useState, useEffect,useRef } from "react";
import { useSearchParams } from "next/navigation";

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";


import {
  getProjects,
} from "@/lib/projects";

import {
  getConversations,
  createConversation,
} from "@/lib/chat";

import { ConversationHistory } from "@/features/ai/ConversationHistory";
import { AiPanel } from "@/features/ai/AiPanel";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

import { useWorkspaceStore } from "@/store/workspaceStore";

export default function AiPage() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initializedFromUrl = useRef(false);
  const projectFromUrl =
    searchParams.get("project");

  const conversationFromUrl =
    searchParams.get("conversation");


  const {
    data: projects = [],
  } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  const [
    selectedProject,
    setSelectedProject,
  ] = useState("");

  const {
  activeConversationId,
  setActiveConversation,
  setActiveProject,
} = useWorkspaceStore();

  useEffect(() => {
  if (!projects.length) return;

  let projectId = projectFromUrl;

  if (
    !projectId ||
    !projects.some((p) => p.id === projectId)
  ) {
    projectId = projects[0].id;
  }

  setSelectedProject(projectId);
  setActiveProject(projectId);
}, [
  projects,
  projectFromUrl,
  setActiveProject,
]);

  const {
    data: conversations = [],
  } = useQuery({
    queryKey: [
      "conversations",
      selectedProject,
    ],
    queryFn: () =>
      getConversations(selectedProject),
    enabled: !!selectedProject,
  });

  useEffect(() => {
  if (!conversations.length) return;

  if (!initializedFromUrl.current) {
    initializedFromUrl.current = true;

    if (
      conversationFromUrl &&
      conversations.some(c => c.id === conversationFromUrl)
    ) {
      setActiveConversation(conversationFromUrl);
      return;
    }
  }

  if (
    activeConversationId &&
    conversations.some(c => c.id === activeConversationId)
  ) {
    return;
  }


  setActiveConversation(conversations[0].id);
}, [
  conversations,
  conversationFromUrl,
  activeConversationId,
  setActiveConversation,
]);

  const createConvMutation =
    useMutation({
      mutationFn: () =>
        createConversation({
          projectId: selectedProject,
          title: "New conversation",
        }),

      onSuccess: (conversation) => {
  queryClient.setQueryData(
    ["conversations", selectedProject],
    (old: any[] = []) => [conversation, ...old]
  );

  setActiveConversation(conversation.id);

  queryClient.invalidateQueries({
    queryKey: ["conversations", selectedProject],
  });
}
    });
    console.log({
  projectFromUrl,
  selectedProject,
});

  return (
    <div className="flex h-full overflow-hidden bg-gray-50">

      <div className="w-[260px] shrink-0 border-r border-gray-200 bg-white">

        <div className="border-b border-gray-200 p-4">

          <label className="mb-2 block text-xs font-medium uppercase text-gray-500">
            Project
          </label>

          <select
            value={selectedProject}
            onChange={(e) => {
  const projectId = e.target.value;

  router.replace(`/ai?project=${projectId}`);

  setSelectedProject(projectId);
  setActiveProject(projectId);
  setActiveConversation(null);
}}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
          >
            {projects.map(
              (project) => (
                <option
                  key={project.id}
                  value={project.id}
                >
                  {project.name}
                </option>
              )
            )}
          </select>

        </div>

        <ConversationHistory
          projectId={
            selectedProject
          }
          activeConversationId={
            activeConversationId
          }
          onConversationSelect={
            setActiveConversation
          }
          onNewConversation={() =>
            createConvMutation.mutate()
          }
        />

      </div>

      <div className="flex min-w-0 flex-1 flex-col">

        <div className="border-b border-gray-200 bg-white px-6 py-4">

          <div className="flex items-center justify-between">

            <div>

              <h1 className="text-xl font-semibold">
                AI Assistant
              </h1>

              <p className="text-sm text-gray-500">
                Chat with your research.
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

        <div className="flex flex-1">

          {activeConversationId ? (

            <AiPanel
              conversationId={
                activeConversationId
              }
              mode="full"
            />

          ) : (

            <div className="flex flex-1 items-center justify-center bg-white">

              <div className="text-center">

                <h2 className="text-xl font-semibold">
                  Welcome to Mnemo AI
                </h2>

                <p className="mt-2 mb-6 text-gray-500">
                  Create a conversation to begin.
                </p>

                <Button
                  onClick={() =>
                    createConvMutation.mutate()
                  }
                >
                  + New Conversation
                </Button>

              </div>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}