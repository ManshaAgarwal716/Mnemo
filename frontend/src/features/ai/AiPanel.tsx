"use client";

import { Circle, Maximize2, MoreVertical } from "lucide-react";

import { Tabs } from "@/components/ui/Tabs";
import { useUiStore } from "@/store/uiStore";
import { cn } from "@/lib/utils";

import { ChatInput } from "./ChatInput";
import { ChatThread } from "./ChatThread";
import { ConceptChips } from "./ConceptChips";
import { QuickActions } from "./QuickActions";
import { RelatedTab } from "./RelatedTab";
import { SummaryTab } from "./SummaryTab";

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
                <button className="rounded p-1 hover:bg-gray-100">
                  <Maximize2 className="h-4 w-4 text-gray-500" />
                </button>

                <button className="rounded p-1 hover:bg-gray-100">
                  <MoreVertical className="h-4 w-4 text-gray-500" />
                </button>
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
            <ConceptChips />
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
    </div>
  );
}