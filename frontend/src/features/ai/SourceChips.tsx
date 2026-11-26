"use client";

import { FileText, StickyNote } from "lucide-react";
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

  const { openDocument, openNote, activeProjectId } = useWorkspaceStore();
  const projectId = (params.projectId as string) || activeProjectId;

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-gray-500">
        Sources
      </p>

      <div className="flex flex-wrap gap-2">
        {sources.map((source) => (
          <button
            key={source.note_id || source.document_id}
            type="button"
            title={source.excerpt || source.title}
            onClick={() => {
              if (source.note_id) {
                openNote(source.note_id, source.title);
              } else if (source.document_id) {
                openDocument(source.document_id, source.title);
              }

              if (projectId) router.push(`/workspace/${projectId}`);
            }}
            className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs shadow-sm transition hover:border-primary hover:bg-primary-light"
          >
            {source.note_id ? <StickyNote className="h-3.5 w-3.5 text-primary" /> : <FileText className="h-3.5 w-3.5 text-primary" />}

            <span className="max-w-[180px] truncate">
              {source.note_id ? "Note" : "Document"}: {source.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
