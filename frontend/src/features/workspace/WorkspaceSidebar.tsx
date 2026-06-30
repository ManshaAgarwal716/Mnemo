"use client";

import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Search, FileText, StickyNote, Upload, Plus, ChevronLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getDocuments } from "@/lib/documents";
import { cn, formatRelativeTime } from "@/lib/utils";
import { useWorkspaceStore } from "@/store/workspaceStore";
import Link from "next/link";

interface WorkspaceSidebarProps {
  projectId: string;
}

export function WorkspaceSidebar({ projectId }: WorkspaceSidebarProps) {
  const { data: documents = [] } = useQuery({
    queryKey: ["documents", projectId],
    queryFn: () => getDocuments(projectId),
  });

  const { addTab, activeTabId } = useWorkspaceStore();

  const handleDocumentClick = (doc: any) => {
    const icon = doc.type === "pdf" ? "file-text" : doc.type === "note" ? "sticky-note" : "globe";
    addTab({
      id: `tab-${doc.id}`,
      type: doc.type === "note" ? "note" : "document",
      documentId: doc.id,
      title: doc.name,
      icon: icon as any,
    });
  };

  const pdfs = documents.filter((d) => d.type === "pdf");
  const notes = documents.filter((d) => d.type === "note");

  return (
    <div className="w-[190px] border-r border-gray-200 bg-white flex flex-col h-full">
      <div className="p-3 border-b border-gray-200">
        <div className="relative mb-3">
          <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-gray-400" />
          <Input
            placeholder="Search..."
            className="pl-8 h-8 text-xs"
          />
        </div>
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-xs text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          All projects
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-500 uppercase">
              Documents
            </span>
            <span className="text-xs text-gray-400">{pdfs.length}</span>
          </div>
          <div className="space-y-0.5">
            {pdfs.map((doc) => (
              <button
                key={doc.id}
                onClick={() => handleDocumentClick(doc)}
                className={cn(
                  "w-full flex items-start gap-2 px-2 py-1.5 rounded text-xs text-left transition-colors",
                  activeTabId === `tab-${doc.id}`
                    ? "bg-primary-light text-primary"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <FileText className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span className="truncate">{doc.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-500 uppercase">
              Notes
            </span>
            <span className="text-xs text-gray-400">{notes.length}</span>
          </div>
          <div className="space-y-0.5">
            {notes.map((note) => (
              <button
                key={note.id}
                onClick={() => handleDocumentClick(note)}
                className={cn(
                  "w-full flex items-start gap-2 px-2 py-1.5 rounded text-xs text-left transition-colors",
                  activeTabId === `tab-${note.id}`
                    ? "bg-primary-light text-primary"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <StickyNote className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span className="truncate">{note.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-3 border-t border-gray-200 space-y-2">
        <Button size="sm" className="w-full justify-start" variant="outline">
          <Upload className="w-3.5 h-3.5 mr-2" />
          Upload
        </Button>
        <Button size="sm" className="w-full justify-start" variant="outline">
          <Plus className="w-3.5 h-3.5 mr-2" />
          New note
        </Button>
      </div>
    </div>
  );
}
