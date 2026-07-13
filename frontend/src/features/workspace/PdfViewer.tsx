"use client";

import { useQuery } from "@tanstack/react-query";
import { getDocument } from "@/lib/documents";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Maximize2,
} from "lucide-react";

interface PdfViewerProps {
  documentId: string;
}

export function PdfViewer({ documentId }: PdfViewerProps) {
  const { data: document, isLoading } = useQuery({
    queryKey: ["document", documentId],
    queryFn: () => getDocument(documentId),
  });

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        Loading PDF...
      </div>
    );
  }

  if (!document) {
    return (
      <div className="flex-1 flex items-center justify-center">
        PDF not found
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 bg-gray-50">
      {/* Toolbar */}
      <div className="h-12 border-b bg-white flex items-center justify-between px-4">

        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-100 rounded">
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button className="p-2 hover:bg-gray-100 rounded">
            <ChevronRight className="w-4 h-4" />
          </button>

          <span className="text-sm text-gray-600">
            {document.title}
          </span>
        </div>

        <div className="flex items-center gap-2">

          <a
            href={document.filePath}
            download
            target="_blank"
            className="p-2 hover:bg-gray-100 rounded"
          >
            <Download className="w-4 h-4" />
          </a>

          <button
            onClick={() => window.open(document.filePath, "_blank")}
            className="p-2 hover:bg-gray-100 rounded"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

        </div>
      </div>

      {/* PDF */}

      <div className="flex-1">
        <iframe
          src={document.filePath}
          title={document.title}
          className="w-full h-full border-0"
        />
      </div>
    </div>
  );
}