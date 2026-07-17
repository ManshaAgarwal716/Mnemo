"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  FileText,
  FolderKanban,
  MessageSquare,
  StickyNote,
  ArrowRight,
} from "lucide-react";

import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { getDashboard } from "@/lib/dashboard";
import { formatRelativeTime } from "@/lib/utils";
import { useWorkspaceStore } from "@/store/workspaceStore";

interface RecentActivityProps {
  showHeader?: boolean;
  maxItems?: number;
}

const iconStyles = {
  project: {
    icon: FolderKanban,
    bg: "bg-purple-100",
    text: "text-purple-600",
  },
  document: {
    icon: FileText,
    bg: "bg-blue-100",
    text: "text-blue-600",
  },
  note: {
    icon: StickyNote,
    bg: "bg-yellow-100",
    text: "text-yellow-600",
  },
  conversation: {
    icon: MessageSquare,
    bg: "bg-green-100",
    text: "text-green-600",
  },
};

export function RecentActivity({
  showHeader = true,
  maxItems,
}: RecentActivityProps) {
  const router = useRouter();

  const {
    openDocument,
    setActiveConversation,
  } = useWorkspaceStore();

  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboard,
  });

  if (isLoading) {
    return (
      <Card className="p-6">
        <Skeleton className="h-56 w-full" />
      </Card>
    );
  }

  const handleClick = (activity: any) => {
    switch (activity.type) {
      case "project":
        router.push(`/workspace/${activity.project_id}`);
        break;

      case "document":
        if (
          activity.document_id &&
          activity.project_id
        ) {
          openDocument(
            activity.document_id,
            activity.name,
          );

          router.push(
            `/workspace/${activity.project_id}`,
          );
        }
        break;

      case "conversation":
        if (
          activity.project_id &&
          activity.conversation_id
        ) {
          setActiveConversation(
            activity.conversation_id,
          );

          router.push(
            `/workspace/${activity.project_id}/ai`,
          );
        }
        break;

      case "note":
        if (activity.project_id) {
          router.push(
            `/workspace/${activity.project_id}`,
          );
        }
        break;
    }
  };
  const activities =
  maxItems !== undefined
    ? (data?.recent_activity ?? []).slice(0, maxItems)
    : data?.recent_activity ?? [];

  return (
    <Card className="p-6">
      {showHeader && (
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            Recent Activity
          </h2>

          <button
            onClick={() => router.push("/activity")}
            className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            View all
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="space-y-1">
        {activities.map((activity) => {
          const style =
            iconStyles[activity.type];

          const Icon = style.icon;

          return (
            <button
              key={activity.id}
              onClick={() =>
                handleClick(activity)
              }
              className="flex w-full items-center gap-4 rounded-xl p-3 text-left transition-all hover:bg-gray-50"
            >
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${style.bg}`}
              >
                <Icon
                  className={`h-5 w-5 ${style.text}`}
                />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-gray-900">
                  {activity.name}
                </p>

                <p className="text-xs text-gray-500">
                  {activity.subtitle}
                </p>
              </div>

              <span className="text-xs text-gray-400">
                {formatRelativeTime(
                  activity.timestamp,
                )}
              </span>
            </button>
          );
        })}
      </div>
    </Card>
  );
}