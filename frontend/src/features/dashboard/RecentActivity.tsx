"use client";

import { Card } from "@/components/ui/Card";
import { FileText, StickyNote, MessageSquare } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";

const activities = [
  {
    id: "1",
    type: "document",
    icon: FileText,
    name: "Attention Is All You Need",
    subtitle: "Added to Transformer architecture research",
    timestamp: "2026-06-19T14:30:00Z",
  },
  {
    id: "2",
    type: "conversation",
    icon: MessageSquare,
    name: "How does self-attention work?",
    subtitle: "New AI conversation",
    timestamp: "2026-06-20T10:30:00Z",
  },
  {
    id: "3",
    type: "note",
    icon: StickyNote,
    name: "My research notes on self-attention",
    subtitle: "Updated in Transformer architecture research",
    timestamp: "2026-06-18T16:20:00Z",
  },
  {
    id: "4",
    type: "document",
    icon: FileText,
    name: "BERT: Pre-training Deep Bidirectional Transformers",
    subtitle: "Added to Transformer architecture research",
    timestamp: "2026-06-19T12:15:00Z",
  },
];

export function RecentActivity() {
  return (
    <Card className="p-6">
      <h2 className="text-base font-medium text-gray-900 mb-4">
        Recent activity
      </h2>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3">
            <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center shrink-0">
              <activity.icon className="w-4 h-4 text-gray-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {activity.name}
              </p>
              <p className="text-xs text-gray-600">{activity.subtitle}</p>
            </div>
            <span className="text-xs text-gray-500 shrink-0">
              {formatRelativeTime(activity.timestamp)}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
