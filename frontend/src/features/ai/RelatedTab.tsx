"use client";

import { useQuery } from "@tanstack/react-query";
import { FileText } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { getRelated } from "@/lib/chat";

interface RelatedTabProps {
  conversationId: string;
}

export function RelatedTab({
  conversationId,
}: RelatedTabProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["related", conversationId],
    queryFn: () => getRelated(conversationId),
  });

  if (isLoading) {
    return (
      <div className="p-4 text-sm text-gray-500">
        Finding related content...
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const items = [
    ...data.documents,
    ...data.notes,
    ...data.conversations,
  ];

  return (
    <div className="space-y-3 overflow-y-auto p-4">
      {items.map((item) => (
        <Card
          key={item.id}
          hover
          className="cursor-pointer p-4"
        >
          <div className="mb-2 flex items-start gap-2">
            <FileText className="mt-0.5 h-4 w-4 shrink-0 text-gray-500" />

            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-start justify-between gap-2">
                <h4 className="line-clamp-2 text-sm font-medium">
                  {item.title}
                </h4>

                <Badge
                  variant="outline"
                  size="sm"
                >
                  {Math.round(item.similarity * 100)}%
                </Badge>
              </div>

              <p className="line-clamp-2 text-xs text-gray-600">
                {item.snippet}
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}