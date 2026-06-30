"use client";

import { Sparkles, Network, GraduationCap } from "lucide-react";

const actions = [
  { label: "Summarize", icon: Sparkles },
  { label: "Find connections", icon: Network },
  { label: "Quiz me", icon: GraduationCap },
];

export function QuickActions() {
  return (
    <div className="flex gap-2 px-4 py-2">
      {actions.map((action) => (
        <button
          key={action.label}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded text-xs text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <action.icon className="w-3.5 h-3.5" />
          {action.label}
        </button>
      ))}
    </div>
  );
}
