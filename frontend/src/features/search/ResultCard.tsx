"use client";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SearchResult } from "@/types";
import { FileText, StickyNote, MessageSquare } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface ResultCardProps {
  result: SearchResult;
}

const iconMap = {
  pdf: FileText,
  note: StickyNote,
  conversation: MessageSquare,
};

const colorMap = {
  pdf: "text-blue-600",
  note: "text-amber-600",
  conversation: "text-primary",
};

export function ResultCard({ result }: ResultCardProps) {
  const router = useRouter();
  const Icon = iconMap[result.type];

  const handleClick = () => {
    if (result.type === "conversation") {
      router.push("/ai");
    } else if (result.projectId) {
      router.push(`/workspace/${result.projectId}`);
    }
  };

  return (
    <Card hover onClick={handleClick} className="p-5">
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 ${colorMap[result.type]}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3 className="text-base font-medium text-gray-900 line-clamp-1">
              {result.title}
            </h3>
            <Badge variant="outline" size="sm" className="shrink-0">
              {result.matchPercentage}%
            </Badge>
          </div>
          <p
            className="text-sm text-gray-600 mb-3 line-clamp-2"
            dangerouslySetInnerHTML={{
              __html: result.snippet.replace(
                /\*\*(.*?)\*\*/g,
                '<mark class="bg-yellow-200">$1</mark>'
              ),
            }}
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {result.tags?.map((tag) => (
                <Badge key={tag} variant="gray" size="sm">
                  {tag}
                </Badge>
              ))}
            </div>
            <span className="text-xs text-gray-500">
              {formatRelativeTime(result.timestamp)}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
