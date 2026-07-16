"use client";

import { useRouter } from "next/navigation";

import {
  FileText,
  StickyNote,
  MessageSquare,
  FolderKanban,
} from "lucide-react";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

import { SearchResult } from "@/types";

import { formatRelativeTime } from "@/lib/utils";

const iconMap = {
  project: FolderKanban,
  document: FileText,
  note: StickyNote,
  conversation: MessageSquare,
};

const colorMap = {
  project: "text-purple-600",
  document: "text-blue-600",
  note: "text-yellow-600",
  conversation: "text-green-600",
};

export function ResultCard({
  result,
}: {
  result: SearchResult;
}) {
  const router = useRouter();

  const Icon = iconMap[result.type];

  const handleClick = () => {
    switch (result.type) {
      case "project":
        router.push(`/workspace/${result.projectId}`);
        break;

      case "document":
        router.push(`/workspace/${result.projectId}`);
        break;

      case "note":
        router.push(`/workspace/${result.projectId}`);
        break;

      case "conversation":
        router.push(
          `/workspace/${result.projectId}/ai`,
        );
        break;
    }
  };

  return (
    <Card
      hover
      onClick={handleClick}
      className="cursor-pointer p-5"
    >
      <div className="flex items-start gap-4">
        <div className={colorMap[result.type]}>
          <Icon className="h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-start justify-between">
            <h3 className="truncate text-base font-semibold">
              {result.title}
            </h3>

            <Badge
              variant="outline"
              size="sm"
            >
              {result.matchPercentage}%
            </Badge>
          </div>

          <p className="mb-3 line-clamp-2 text-sm text-gray-600">
            {result.snippet}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {result.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="gray"
                  size="sm"
                >
                  {tag}
                </Badge>
              ))}
            </div>

            <span className="text-xs text-gray-500">
              {formatRelativeTime(
                result.timestamp,
              )}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}