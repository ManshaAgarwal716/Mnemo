"use client";

import { useState } from "react";
import {
  MoreVertical,
  Maximize2,
  Pencil,
  Trash2,
  RotateCcw,
} from "lucide-react";

interface AiMenuProps {
  onOpenFull: () => void;
  onRename: () => void;
  onDelete: () => void;
  onClear: () => void;
}

export function AiMenu({
  onOpenFull,
  onRename,
  onDelete,
  onClear,
}: AiMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">

      <button
        onClick={() => setOpen(!open)}
        className="rounded p-1 hover:bg-gray-100"
      >
        <MoreVertical className="h-4 w-4 text-gray-500" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-52 rounded-lg border border-gray-200 bg-white shadow-lg z-50">

          <button
            onClick={() => {
              setOpen(false);
              onOpenFull();
            }}
            className="flex w-full items-center gap-3 px-3 py-2 text-sm hover:bg-gray-50"
          >
            <Maximize2 className="h-4 w-4" />
            Open Full AI
          </button>

          <button
            onClick={() => {
              setOpen(false);
              onRename();
            }}
            className="flex w-full items-center gap-3 px-3 py-2 text-sm hover:bg-gray-50"
          >
            <Pencil className="h-4 w-4" />
            Rename Conversation
          </button>

          <button
            onClick={() => {
              setOpen(false);
              onClear();
            }}
            className="flex w-full items-center gap-3 px-3 py-2 text-sm hover:bg-gray-50"
          >
            <RotateCcw className="h-4 w-4" />
            Clear Messages
          </button>

          <button
            onClick={() => {
              setOpen(false);
              onDelete();
            }}
            className="flex w-full items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
            Delete Conversation
          </button>

        </div>
      )}
    </div>
  );
}