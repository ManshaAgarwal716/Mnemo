"use client";

import { Source } from "@/types";
import { FileText } from "lucide-react";

interface SourceChipsProps {
  sources: Source[];
}

export function SourceChips({ sources }: SourceChipsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {sources.map((source, index) => (
        <button
          key={index}
          className="inline-flex items-center gap-1.5 px-2 py-1 bg-white border border-gray-200 rounded text-xs text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <FileText className="w-3 h-3 text-gray-500" />
          <span className="font-medium">{source.documentName}</span>
          {source.page && (
            <span className="text-gray-500">• p.{source.page}</span>
          )}
        </button>
      ))}
    </div>
  );
}
