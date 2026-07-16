"use client";

import { useEffect } from "react";
import { WorkspaceSidebar } from "@/features/workspace/WorkspaceSidebar";
import { TabsBar } from "@/features/workspace/TabsBar";
import { PdfViewer } from "@/features/workspace/PdfViewer";
import { NoteEditor } from "@/features/workspace/NoteEditor";
import { AiPanel } from "@/features/ai/AiPanel";
import { useWorkspaceStore } from "@/store/workspaceStore";
import { useParams } from "next/navigation";
import { EmptyState } from "@/components/ui/EmptyState";
import { FileText } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  getConversations,
  createConversation,
} from "@/lib/chat";
export default function WorkspaceProjectPage() {
  const params = useParams();
  const queryClient = useQueryClient();
  const projectId = params.projectId as string;
  const { setActiveProject,setActiveConversation, activeTabId, tabs,activeConversationId, } = useWorkspaceStore();
  const {
  data: conversations = [],
  isLoading: conversationsLoading,
} = useQuery({
  queryKey: ["conversations", projectId],
  queryFn: () => getConversations(projectId),
  enabled: !!projectId,
});
 console.log("Route projectId:", projectId);
  useEffect(() => {
    console.log("Setting active project:", projectId);
    setActiveProject(projectId);
  }, [projectId, setActiveProject]);

  const activeTab = tabs.find((t) => t.id === activeTabId);

const createConversationMutation = useMutation({
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
useEffect(() => {
  if (!projectId) return;
  if (conversationsLoading) return;
  if (createConversationMutation.isPending) return;
  if (
  activeConversationId &&
  conversations.some(c => c.id === activeConversationId)
) {
  return;
}

  if (conversations.length > 0) {
    setActiveConversation(conversations[0].id);
    return;
  }

  createConversationMutation.mutate();
}, [
  projectId,
  conversations,
  conversationsLoading,
  activeConversationId,
  createConversationMutation.isPending,
  setActiveConversation,
]);

  return (
    <div className="flex h-full">
      <WorkspaceSidebar projectId={projectId} />
      
      <div className="flex-1 flex flex-col">
        <TabsBar />
        
        {activeTab ? (
          activeTab.type === "note" ? (
            <NoteEditor
  noteId={activeTab.documentId}
  projectId={projectId}
/>
          ) : (
            <PdfViewer
  documentId={activeTab.documentId}
/>
          )
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <EmptyState
              icon={FileText}
              title="No document selected"
              description="Select a document or note from the sidebar to start reading"
            />
          </div>
        )}
      </div>

     {activeConversationId ? (
  <AiPanel
    conversationId={activeConversationId}
    mode="compact"
  />
) : (
  <div className="w-[270px] border-l border-gray-200 bg-white flex items-center justify-center text-sm text-gray-500">
    Start a conversation from AI Assistant
  </div>
)}
    </div>
  );
}
