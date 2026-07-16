"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getConversations,
  updateConversation,
  deleteConversation,
} from "@/lib/chat";
import type { Conversation } from "@/types";
import {
  groupConversationsByDate,
  formatRelativeTime,
} from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import {
  Plus,
  MoreVertical,
  Pencil,
  Trash2,
  Check,
  X,
} from "lucide-react";

interface ConversationHistoryProps {
  projectId: string;
  activeConversationId: string | null;
  onConversationSelect: (id: string | null) => void;
  onNewConversation: () => void;
}

export function ConversationHistory({
  projectId,
  activeConversationId,
  onConversationSelect,
  onNewConversation,
}: ConversationHistoryProps) {
  const queryClient = useQueryClient();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: conversations, isLoading } = useQuery({
  queryKey: ["conversations", projectId],
  queryFn: () => getConversations(projectId),
  enabled: !!projectId,
});

  const renameMutation = useMutation({
    mutationFn: ({
      id,
      title,
    }: {
      id: string;
      title: string;
    }) => updateConversation(id, { title }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["conversations"],
      });

      setEditingId(null);
      setMenuOpenId(null);
    },
  });

  const deleteMutation = useMutation({
  mutationFn: deleteConversation,

  onSuccess: async (_, deletedId) => {
    await queryClient.invalidateQueries({
      queryKey: ["conversations", projectId],
    });

    const updated =
      queryClient.getQueryData<Conversation[]>([
        "conversations",
        projectId,
      ]) ?? [];

    if (activeConversationId === deletedId) {
      if (updated.length > 0) {
        onConversationSelect(updated[0].id);
      } else {
        onConversationSelect(null);
      }
    }

    setDeleteOpen(false);
    setDeleteId(null);
    setMenuOpenId(null);
  },
});

  if (isLoading) {
    return (
      <div className="space-y-2 p-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    );
  }

  const grouped = groupConversationsByDate(conversations || []);
  return (
    <>
      <div className="flex h-full flex-col">
        <div className="border-b border-gray-200 p-4">
          <Button
            onClick={onNewConversation}
            className="w-full justify-start"
            size="sm"
          >
            <Plus className="mr-2 h-4 w-4" />
            New conversation
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {Object.entries(grouped).map(([group, convs]) => {
            if (convs.length === 0) return null;

            return (
              <div
                key={group}
                className="mb-6"
              >
                <h3 className="mb-2 text-xs font-medium uppercase text-gray-500">
                  {group}
                </h3>

                <div className="space-y-1">
                  {convs.map((conv) => (
                    <div
                      key={conv.id}
                      className={cn(
                        "group relative rounded transition-colors",
                        activeConversationId === conv.id
                          ? "bg-primary-light"
                          : "hover:bg-gray-100"
                      )}
                    >
                      {editingId === conv.id ? (
                        <div className="flex items-center gap-2 px-3 py-2">
                          <input
                            autoFocus
                            value={editTitle}
                            onChange={(e) =>
                              setEditTitle(e.target.value)
                            }
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                renameMutation.mutate({
                                  id: conv.id,
                                  title: editTitle.trim(),
                                });
                              }

                              if (e.key === "Escape") {
                                setEditingId(null);
                                setEditTitle("");
                              }
                            }}
                            className="flex-1 rounded border border-gray-300 px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-primary"
                          />

                          <button
                            onClick={() =>
                              renameMutation.mutate({
                                id: conv.id,
                                title: editTitle.trim(),
                              })
                            }
                            className="rounded p-1 hover:bg-gray-200"
                          >
                            <Check className="h-4 w-4 text-green-600" />
                          </button>

                          <button
                            onClick={() => {
                              setEditingId(null);
                              setEditTitle("");
                            }}
                            className="rounded p-1 hover:bg-gray-200"
                          >
                            <X className="h-4 w-4 text-gray-500" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <button
                            onClick={() =>
                              onConversationSelect(conv.id)
                            }
                            className={cn(
                              "flex-1 px-3 py-2 text-left",
                              activeConversationId === conv.id
                                ? "text-primary"
                                : "text-gray-700"
                            )}
                          >
                            <p className="truncate text-sm font-medium">
                              {conv.title}
                            </p>

                            <p className="text-xs text-gray-500">
                              {formatRelativeTime(
                                conv.updatedAt
                              )}
                            </p>
                          </button>

                          <div className="relative pr-2">
                            <button
                              onClick={() =>
                                setMenuOpenId(
                                  menuOpenId === conv.id
                                    ? null
                                    : conv.id
                                )
                              }
                              className="rounded p-1 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-gray-200"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </button>
                                                        {menuOpenId === conv.id && (
                              <div className="absolute right-0 top-full z-20 mt-1 w-40 rounded border border-gray-200 bg-white shadow-lg">
                                <button
                                  onClick={() => {
                                    setEditingId(conv.id);
                                    setEditTitle(conv.title);
                                    setMenuOpenId(null);
                                  }}
                                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  <Pencil className="h-4 w-4" />
                                  Rename
                                </button>

                                <button
                                  onClick={() => {
                                    setDeleteId(conv.id);
                                    setDeleteOpen(true);
                                    setMenuOpenId(null);
                                  }}
                                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Modal
  isOpen={deleteOpen}
  onClose={() => {
    setDeleteOpen(false);
    setDeleteId(null);
  }}
  title="Delete conversation"
  size="sm"
>
        <div className="p-6">

          <p className="mb-6 text-sm text-gray-600">
            This action cannot be undone. All messages in this
            conversation will be permanently deleted.
          </p>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setDeleteOpen(false);
                setDeleteId(null);
              }}
            >
              Cancel
            </Button>

            <Button
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteMutation.isPending}
              onClick={() => {
                if (deleteId) {
                  deleteMutation.mutate(deleteId);
                }
              }}
            >
              {deleteMutation.isPending
                ? "Deleting..."
                : "Delete"}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}