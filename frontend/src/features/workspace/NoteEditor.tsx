"use client";

import { Editor } from "@/features/editor/Editor";
import { Input } from "@/components/ui/Input";
import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getNote, updateNote, createNote } from "@/lib/notes";

interface NoteEditorProps {
  noteId?: string;
  projectId: string;
}

export function NoteEditor({ noteId, projectId }: NoteEditorProps) {
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const saveTimeout = useRef<NodeJS.Timeout | null>(null);

  const [saveStatus, setSaveStatus] = useState<
    "saved" | "saving" | "unsaved"
  >("saved");

  const { data: note, isLoading } = useQuery({
    queryKey: ["note", noteId],
    queryFn: () => getNote(noteId!),
    enabled: !!noteId,
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: {
        title?: string;
        content?: string;
      };
    }) => updateNote(id, data),

onSuccess: () => {
  queryClient.invalidateQueries({
    queryKey: ["note", noteId],
  });

  queryClient.invalidateQueries({
    queryKey: ["notes", projectId],
  });
}
  });

  const createMutation = useMutation({
    mutationFn: (data: {
      title: string;
      content: string;
    }) => createNote(projectId, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notes", projectId],
      });
    },
  });

  useEffect(() => {
  if (!note) return;
  setTitle(note.title);
  setContent(note.content || "");
  setSaveStatus("saved");
}, [note]);

  useEffect(() => {
    return () => {
      if (saveTimeout.current) {
        clearTimeout(saveTimeout.current);
      }
    };
  }, []);

  const scheduleSave = (
    updatedTitle: string,
    updatedContent: string
  ) => {
    if (!noteId) return;

    setSaveStatus("unsaved");

    if (saveTimeout.current) {
      clearTimeout(saveTimeout.current);
    }

    saveTimeout.current = setTimeout(() => {
      setSaveStatus("saving");

      updateMutation.mutate(
        {
          id: noteId,
          data: {
            title: updatedTitle,
            content: updatedContent,
          },
        },
        {
          onSuccess: () => {
            setSaveStatus("saved");
          },
        }
      );
    }, 1500);
  };

  const handleSave = () => {
    if (!noteId) {
      createMutation.mutate({
        title,
        content,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col bg-white">
        <div className="border-b border-gray-200 p-4">
          <div className="h-8 bg-gray-100 rounded animate-pulse" />
        </div>

        <div className="flex-1 p-6">
          <div className="h-full bg-gray-100 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      <div className="border-b border-gray-200 p-4 flex items-center gap-3">
        <Input
          value={title}
          placeholder="Untitled note"
          className="text-lg font-medium border-0 focus:ring-0 px-0 flex-1"
          onChange={(e) => {
            const value = e.target.value;

            setTitle(value);

            scheduleSave(value, content);
          }}
        />

        {noteId ? (
          <span className="text-xs text-gray-500 min-w-[70px] text-right">
            {saveStatus === "saving"
  ? "🟡 Saving..."
  : saveStatus === "saved"
  ? "🟢 Saved"
  : "🔴 Unsaved"}
          </span>
        ) : (
          <button
            onClick={handleSave}
            disabled={createMutation.isPending || !title.trim()}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {createMutation.isPending ? "Saving..." : "Save"}
          </button>
        )}
      </div>

      <div className="flex-1 overflow-hidden">
  <Editor
    content={content}
    onChange={(value) => {
      setContent(value);
      scheduleSave(title, value);
    }}
  />
</div>
    </div>
  );
}