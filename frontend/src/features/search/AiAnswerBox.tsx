"use client";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";

interface AiAnswerBoxProps {
  answer: string;
}

export function AiAnswerBox({ answer }: AiAnswerBoxProps) {
  return (
    <Card className="p-6 mb-6">
      <div className="flex items-start gap-3">
        <Avatar size="md" alt="AI" fallback="AI" />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium text-gray-900">AI answer</span>
            <Badge variant="gray" size="sm">
              From your documents
            </Badge>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">{answer}</p>
        </div>
      </div>
    </Card>
  );
}
