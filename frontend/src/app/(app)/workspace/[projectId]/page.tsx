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

export default function WorkspaceProjectPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const { setActiveProject, activeTabId, tabs } = useWorkspaceStore();

  useEffect(() => {
    setActiveProject(projectId);
  }, [projectId, setActiveProject]);

  const activeTab = tabs.find((t) => t.id === activeTabId);

  return (
    <div className="flex h-full">
      <WorkspaceSidebar projectId={projectId} />
      
      <div className="flex-1 flex flex-col">
        <TabsBar />
        
        {activeTab ? (
          activeTab.type === "note" ? (
            <NoteEditor />
          ) : (
            <PdfViewer />
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

      <AiPanel conversationId="conv-1" mode="compact" />
    </div>
  );
}
