"use client";

import { FileText } from "lucide-react";
import { MessageSource } from "@/types";

interface SourceChipsProps {
  sources: MessageSource[];
}

export function SourceChips({
  sources,
}: SourceChipsProps) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-gray-500">
        Sources
      </p>

      <div className="flex flex-wrap gap-2">
        {sources.map((source) => (
          <div
            key={source.document_id}
            className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs shadow-sm"
          >
            <FileText className="h-3.5 w-3.5 text-primary" />

            <span className="truncate max-w-[180px]">
              {source.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}