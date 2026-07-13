"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface RenameDocumentDialogProps {
  open: boolean;
  initialTitle: string;
  onClose: () => void;
  onRename: (title: string) => void;
}

export function RenameDocumentDialog({
  open,
  initialTitle,
  onClose,
  onRename,
}: RenameDocumentDialogProps) {
  const [title, setTitle] = useState(initialTitle);

  useEffect(() => {
    setTitle(initialTitle);
  }, [initialTitle]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="w-[420px] rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h2 className="text-lg font-semibold">
            Rename Document
          </h2>

          <button onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5">
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex justify-end gap-2 border-t px-5 py-4">
          <button
            onClick={onClose}
            className="rounded border px-4 py-2 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={() => {
    if (!title.trim()) return;

    onRename(title);

    onClose();
}}
disabled={!title.trim()}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Rename
          </button>
        </div>
      </div>
    </div>
  );
}