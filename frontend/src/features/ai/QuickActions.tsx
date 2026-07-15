"use client";

import {
  GraduationCap,
  Network,
  Sparkles,
} from "lucide-react";

import { useUiStore } from "@/store/uiStore";

const actions = [
  {
    label: "Summarize",
    icon: Sparkles,
    tab: "summary",
  },
  {
    label: "Find Connections",
    icon: Network,
    tab: "related",
  },
] as const;

export function QuickActions() {
  const { setActiveAiTab } = useUiStore();

  return (
    <div className="flex gap-2 border-t border-gray-200 bg-gray-50 px-4 py-2">
      {actions.map((action) => (
        <button
          key={action.label}
          onClick={() => setActiveAiTab(action.tab)}
          className="flex items-center gap-1.5 rounded border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-700 transition-colors hover:bg-gray-100"
        >
          <action.icon className="h-3.5 w-3.5" />
          {action.label}
        </button>
      ))}
    </div>
  );
}