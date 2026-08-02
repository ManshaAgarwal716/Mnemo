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
  const {
    tabs,
    activeTabId,
    closeTab,
    setActiveTab,
  } = useWorkspaceStore();

  if (tabs.length === 0) {
    return null;
  }

  return (
    <div className="w-full border-b border-gray-200 bg-gray-50">
      <div className="w-full overflow-x-auto overflow-y-hidden">
        <div className="inline-flex min-w-max items-center gap-1 px-2 py-1">
          {tabs.map((tab) => {
            const Icon = iconMap[tab.icon];
            const isActive = activeTabId === tab.id;

            return (
              <div
                key={tab.id}
                className={cn(
                  "group flex h-9 w-[180px] flex-shrink-0 items-center gap-2 rounded px-3 text-sm transition-colors",
                  isActive
                    ? "border border-gray-200 bg-white"
                    : "hover:bg-gray-100"
                )}
              >
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className="flex min-w-0 flex-1 items-center gap-2"
                >
                  <Icon className="h-3.5 w-3.5 shrink-0 text-gray-500" />

                  <span className="truncate text-gray-900">
                    {tab.title}
                  </span>
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    closeTab(tab.id);
                  }}
                  className="rounded p-0.5 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-gray-200"
                >
                  <X className="h-3 w-3 text-gray-500" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}