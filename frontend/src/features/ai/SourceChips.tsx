"use client";

import { FileText } from "lucide-react";
import { useRouter, useParams } from "next/navigation";

import { MessageSource } from "@/types";
import { useWorkspaceStore } from "@/store/workspaceStore";

interface SourceChipsProps {
  sources: MessageSource[];
}

export function SourceChips({
  sources,
}: SourceChipsProps) {
  const router = useRouter();
  const params = useParams();

  const projectId = params.projectId as string;

  const { openDocument } = useWorkspaceStore();

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-gray-500">
        Sources
      </p>

      <div className="flex flex-wrap gap-2">
        {sources.map((source) => (
          <button
            key={source.document_id}
            type="button"
            onClick={() => {
              openDocument(
                source.document_id,
                source.title,
              );

              router.push(`/workspace/${projectId}`);
            }}
            className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs shadow-sm transition hover:border-primary hover:bg-primary-light"
          >
            <FileText className="h-3.5 w-3.5 text-primary" />

            <span className="max-w-[180px] truncate">
              {source.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}