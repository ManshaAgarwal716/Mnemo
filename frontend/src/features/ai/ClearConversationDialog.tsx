"use client";

import { Button } from "@/components/ui/Button";

interface ClearConversationDialogProps {
  open: boolean;
  onClose: () => void;
  onClear: () => void;
  isClearing?: boolean;
}

export function ClearConversationDialog({
  open,
  onClose,
  onClear,
  isClearing = false,
}: ClearConversationDialogProps){
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-[420px] rounded-xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-red-600">
          Clear Messages
        </h2>

        <p className="mt-4 text-sm text-gray-600">
          All messages in this conversation will be permanently removed.
      The conversation will remain and you can continue chatting in it afterwards.
        </p>

        <div className="mt-6 flex justify-end gap-2">
          <Button
            variant="secondary"
            onClick={onClose}
          >
            Cancel
          </Button>

         <Button
  onClick={onClear}
  disabled={isClearing}
  className="bg-red-600 hover:bg-red-700"
>
  {isClearing ? "Clearing..." : "Clear"}
</Button>
        </div>
      </div>
    </div>
  );
}