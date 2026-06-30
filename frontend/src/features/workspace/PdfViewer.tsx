"use client";

import { Card } from "@/components/ui/Card";
import { ChevronLeft, ChevronRight, Maximize2, Highlighter, Bookmark, MessageCircle } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/Badge";

export function PdfViewer() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 15;

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="p-1.5 hover:bg-gray-100 rounded disabled:opacity-50"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm text-gray-700 min-w-[80px] text-center">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 hover:bg-gray-100 rounded disabled:opacity-50"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <button className="p-1.5 hover:bg-gray-100 rounded">
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* PDF Content Area */}
      <div className="flex-1 overflow-y-auto p-6">
        <Card className="max-w-3xl mx-auto p-8">
          {/* Simulated PDF content with skeleton lines */}
          <div className="space-y-3 mb-6">
            <div className="h-5 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-100 rounded"></div>
            <div className="h-3 bg-gray-100 rounded"></div>
            <div className="h-3 bg-gray-100 rounded w-11/12"></div>
          </div>

          {/* AI-annotated callout */}
          <div className="my-6 p-4 bg-primary-light border-l-4 border-primary rounded">
            <div className="flex items-start gap-2 mb-2">
              <Badge variant="primary" size="sm">AI insight</Badge>
            </div>
            <p className="text-sm text-gray-800 italic">
              "An attention function can be described as mapping a query and a set of
              key-value pairs to an output, where the query, keys, values, and output are
              all vectors."
            </p>
            <p className="text-xs text-gray-600 mt-2">
              This introduces the core concept of the attention mechanism used in transformers.
            </p>
          </div>

          <div className="space-y-3 mb-6">
            <div className="h-3 bg-gray-100 rounded"></div>
            <div className="h-3 bg-gray-100 rounded"></div>
            <div className="h-3 bg-gray-100 rounded w-10/12"></div>
            <div className="h-3 bg-gray-100 rounded"></div>
          </div>

          <div className="space-y-3">
            <div className="h-3 bg-gray-100 rounded w-11/12"></div>
            <div className="h-3 bg-gray-100 rounded"></div>
            <div className="h-3 bg-gray-100 rounded"></div>
            <div className="h-3 bg-gray-100 rounded w-9/12"></div>
          </div>
        </Card>
      </div>

      {/* Footer Actions */}
      <div className="bg-white border-t border-gray-200 px-4 py-2 flex items-center justify-center gap-6">
        <button className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 transition-colors">
          <Highlighter className="w-4 h-4" />
          Highlight
        </button>
        <button className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 transition-colors">
          <Bookmark className="w-4 h-4" />
          Bookmark
        </button>
        <button className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 transition-colors">
          <MessageCircle className="w-4 h-4" />
          Comment
        </button>
      </div>
    </div>
  );
}
