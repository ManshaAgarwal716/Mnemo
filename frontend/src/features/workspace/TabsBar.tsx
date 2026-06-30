"use client";

import { X, FileText, StickyNote, Globe } from "lucide-react";
import { useWorkspaceStore } from "@/store/workspaceStore";
import { cn } from "@/lib/utils";

const iconMap = {
  "file-text": FileText,
  "sticky-note": StickyNote,
  globe: Globe,
};

export function TabsBar() {
  const { tabs, activeTabId, closeTab, setActiveTab } = useWorkspaceStore();

  if (tabs.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-1 bg-gray-50 border-b border-gray-200 px-2 py-1">
      {tabs.map((tab) => {
        const Icon = iconMap[tab.icon];
        const isActive = activeTabId === tab.id;

        return (
          <div
            key={tab.id}
            className={cn(
              "group flex items-center gap-2 px-3 py-1.5 rounded text-sm max-w-[200px] transition-colors",
              isActive
                ? "bg-white border border-gray-200"
                : "hover:bg-gray-100"
            )}
          >
            <button
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 flex-1 min-w-0"
            >
              <Icon className="w-3.5 h-3.5 text-gray-500 shrink-0" />
              <span className="truncate text-gray-900">{tab.title}</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeTab(tab.id);
              }}
              className="opacity-0 group-hover:opacity-100 hover:bg-gray-200 rounded p-0.5 transition-opacity"
            >
              <X className="w-3 h-3 text-gray-500" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
