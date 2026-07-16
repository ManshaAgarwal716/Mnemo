"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";

interface RenameConversationDialogProps {
  open: boolean;
  currentTitle: string;
  onClose: () => void;
  onSave: (title: string) => void;
}

export function RenameConversationDialog({
  open,
  currentTitle,
  onClose,
  onSave,
}: RenameConversationDialogProps) {
  const [title, setTitle] = useState(currentTitle);

  useEffect(() => {
    setTitle(currentTitle);
  }, [currentTitle]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-[420px] rounded-xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-semibold">
          Rename Conversation
        </h2>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-4 w-full rounded-lg border border-gray-300 px-3 py-2"
          placeholder="Conversation title"
        />

        <div className="mt-6 flex justify-end gap-2">
          <Button
            variant="secondary"
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button
            onClick={() => {
              if (!title.trim()) return;
              onSave(title.trim());
            }}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}