"use client";

import { useEffect, useRef, useState } from "react";
import {
  MoreVertical,
  Pencil,
  Download,
  Trash2,
} from "lucide-react";

interface DocumentMenuProps {
  onRename: () => void;
  onDownload: () => void;
  onDelete: () => void;
}

export function DocumentMenu({
  onRename,
  onDownload,
  onDelete,
}: DocumentMenuProps) {
  const [open, setOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  return (
<div
  ref={menuRef}
  className="relative ml-1 shrink-0"

>
      <button
  onClick={() => setOpen(!open)}
  className="rounded p-1 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-gray-200"
>
        <MoreVertical className="w-6 h-6 text-red-500" />
      </button>

      {open && (
        <div className="absolute right-0 top-8 z-50 w-44 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl">

          <button
            onClick={() => {
              setOpen(false);
              onRename();
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50"
          >
            <Pencil className="w-4 h-4" />
            Rename
          </button>

          <button
            onClick={() => {
              setOpen(false);
              onDownload();
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50"
          >
            <Download className="w-4 h-4" />
            Download
          </button>

          <button
            onClick={() => {
              setOpen(false);
              onDelete();
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>

        </div>
      )}
    </div>
  );
}