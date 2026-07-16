"use client";

import { Button } from "@/components/ui/Button";

interface DeleteConversationDialogProps {
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
  isDeleting?: boolean;
}

export function DeleteConversationDialog({
  open,
  onClose,
  onDelete,
  isDeleting = false,
}: DeleteConversationDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-[420px] rounded-xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-red-600">
          Delete Conversation
        </h2>

        <p className="mt-4 text-sm text-gray-600">
          This conversation and all of its messages will be permanently deleted.
          This action cannot be undone.
        </p>

        <div className="mt-6 flex justify-end gap-2">
          <Button
            variant="secondary"
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button
            onClick={onDelete}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>
    </div>
  );
}