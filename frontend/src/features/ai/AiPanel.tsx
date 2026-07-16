"use client";

import { Circle, Maximize2, MoreVertical } from "lucide-react";

import { Tabs } from "@/components/ui/Tabs";
import { useUiStore } from "@/store/uiStore";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMutation, useQueryClient,  useQuery, } from "@tanstack/react-query";
import {
  getConversation,
  updateConversation,
  deleteConversation,
} from "@/lib/chat";
import { clearConversationMessages } from "@/lib/chat";
import { ClearConversationDialog } from "./ClearConversationDialog";
import { RenameConversationDialog } from "./RenameConversationDialog";
import { useWorkspaceStore } from "@/store/workspaceStore";
import { ChatInput } from "./ChatInput";
import { ChatThread } from "./ChatThread";
import { QuickActions } from "./QuickActions";
import { RelatedTab } from "./RelatedTab";
import { DeleteConversationDialog } from "./DeleteConversationDialog";
import { SummaryTab } from "./SummaryTab";
import { AiMenu } from "./AiMenu";
interface AiPanelProps {
  conversationId: string;
  mode?: "compact" | "full";
}

export function AiPanel({
  conversationId,
  mode = "compact",
}: AiPanelProps) {
  const {
    activeAiTab,
    setActiveAiTab,
  } = useUiStore();
  const { setActiveConversation } = useWorkspaceStore();
  const router = useRouter();
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
  mutationFn: () => deleteConversation(conversationId),

  onSuccess: () => {
    queryClient.invalidateQueries({
      queryKey: ["conversations"],
    });

    setActiveConversation(null);
  },
});
  const [renameOpen, setRenameOpen] = useState(false);
  const { activeProjectId } =
  useWorkspaceStore();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [clearOpen, setClearOpen] = useState(false);
  const tabs = [
    {
      id: "chat",
      label: "Chat",
    },
    {
      id: "summary",
      label: "Summary",
    },
    {
      id: "related",
      label: "Related",
    },
  ];
  const { data: conversation } = useQuery({
  queryKey: ["conversation", conversationId],
  queryFn: () => getConversation(conversationId),
  enabled: !!conversationId,
});
  const renameMutation = useMutation({
  mutationFn: (title: string) =>
    updateConversation(conversationId, {
      title,
    }),

  onSuccess: () => {
    queryClient.invalidateQueries({
      queryKey: ["conversations"],
    });

    queryClient.invalidateQueries({
      queryKey: ["conversation", conversationId],
    });

    setRenameOpen(false);
  },
});
const clearMutation = useMutation({
  mutationFn: () =>
    clearConversationMessages(conversationId),

  onSuccess: () => {
    queryClient.invalidateQueries({
      queryKey: ["messages", conversationId],
    });

    setClearOpen(false);
  },
});


  return (
    <div
      className={cn(
        "flex h-full flex-col bg-white",
        mode === "compact"
          ? "w-[270px] border-l border-gray-200"
          : "flex-1"
      )}
    >
      <div className="border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Circle className="h-2 w-2 fill-teal text-teal" />
            <span className="text-sm font-medium text-gray-800">
              Mnemo AI
            </span>
          </div>

          <div className="flex items-center gap-1">
            {mode === "compact" && (
              <>
                <button
  onClick={() =>
    router.push(
      `/ai?project=${activeProjectId}&conversation=${conversationId}`
    )
  }
  className="rounded p-1 hover:bg-gray-100"
>
  <Maximize2 className="h-4 w-4 text-gray-500" />
</button>

                <AiMenu
  onOpenFull={() =>
    router.push(
      `/ai?project=${activeProjectId}&conversation=${conversationId}`
    )
  }
  onRename={() => setRenameOpen(true)}
  onDelete={() => setDeleteOpen(true)}
  onClear={() => setClearOpen(true)}
/>
              </>
            )}
          </div>
        </div>
      </div>

      <Tabs
        tabs={tabs}
        activeTab={activeAiTab}
        onChange={(tab) =>
          setActiveAiTab(tab as "chat" | "summary" | "related")
        }
        className="px-4"
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        {activeAiTab === "chat" && (
          <>
            <ChatThread conversationId={conversationId} />
            <QuickActions />
            <ChatInput conversationId={conversationId} />
          </>
        )}

        {activeAiTab === "summary" && (
          <SummaryTab conversationId={conversationId} />
        )}

        {activeAiTab === "related" && (
          <RelatedTab conversationId={conversationId} />
        )}
      </div>
      <RenameConversationDialog
  open={renameOpen}
  currentTitle={conversation?.title ?? ""}
  onClose={() => setRenameOpen(false)}
  onSave={(title) => renameMutation.mutate(title)}
/>
  <DeleteConversationDialog
  open={deleteOpen}
  onClose={() => setDeleteOpen(false)}
  onDelete={() => deleteMutation.mutate()}
  isDeleting={deleteMutation.isPending}
/>
<ClearConversationDialog
  open={clearOpen}
  onClose={() => setClearOpen(false)}
  onClear={() => clearMutation.mutate()}
  isClearing={clearMutation.isPending}
/>
    </div>
  );
}
