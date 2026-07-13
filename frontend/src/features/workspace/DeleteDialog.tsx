"use client";

import { Button } from "@/components/ui/Button";

interface DeleteDialogProps {
  open: boolean;
  title: string;
  itemName: string;
  onClose: () => void;
  onDelete: () => void;
}

export function DeleteDialog({
  open,
  title,
  itemName,
  onClose,
  onDelete,
}: DeleteDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-semibold">
          {title}
        </h2>

        <p className="mt-3 text-sm text-gray-600">
          Are you sure you want to delete{" "}
          <span className="font-medium">
            "{itemName}"
          </span>
          ?
        </p>

        <p className="mt-2 text-xs text-red-500">
          This action cannot be undone.
        </p>

        <div className="mt-6 flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button
             className="bg-red-600 text-white hover:bg-red-700"
            onClick={onDelete}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}