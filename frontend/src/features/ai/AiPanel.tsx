"use client";

import { Maximize2, MoreVertical, Circle } from "lucide-react";
import { Tabs } from "@/components/ui/Tabs";
import { useUiStore } from "@/store/uiStore";
import { ChatThread } from "./ChatThread";
import { ChatInput } from "./ChatInput";
import { ConceptChips } from "./ConceptChips";
import { QuickActions } from "./QuickActions";
import { SummaryTab } from "./SummaryTab";
import { RelatedTab } from "./RelatedTab";

interface AiPanelProps {
  conversationId: string;
  mode?: "compact" | "full";
}

export function AiPanel({ conversationId, mode = "compact" }: AiPanelProps) {
  const { activeAiTab, setActiveAiTab } = useUiStore();

  const tabs = [
    { id: "chat", label: "Chat" },
    { id: "summary", label: "Summary" },
    { id: "related", label: "Related" },
  ];

  return (
    <div className="w-[270px] border-l border-gray-200 bg-white flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Circle className="w-2 h-2 fill-teal text-teal" />
            <span className="text-xs font-medium text-gray-700">Mnemo AI</span>
          </div>
          <div className="flex items-center gap-1">
            <button className="p-1 hover:bg-gray-100 rounded">
              <Maximize2 className="w-3.5 h-3.5 text-gray-500" />
            </button>
            <button className="p-1 hover:bg-gray-100 rounded">
              <MoreVertical className="w-3.5 h-3.5 text-gray-500" />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      {mode === "compact" && (
        <Tabs
          tabs={tabs}
          activeTab={activeAiTab}
          onChange={(tab) => setActiveAiTab(tab as any)}
          className="px-4"
        />
      )}

      {/* Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {activeAiTab === "chat" && (
          <>
            <ChatThread conversationId={conversationId} />
            <ConceptChips />
            <QuickActions />
            <ChatInput conversationId={conversationId} />
          </>
        )}
        {activeAiTab === "summary" && <SummaryTab />}
        {activeAiTab === "related" && <RelatedTab />}
      </div>
    </div>
  );
}
