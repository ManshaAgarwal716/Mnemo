"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Document, Note } from "@/types";
import {
  Search,
  FileText,
  StickyNote,
  Upload,
  Plus,
  ChevronLeft,
} from "lucide-react";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { NoteMenu } from "./NoteMenu";

import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

import {
  getDocuments,
  uploadDocument,
  deleteDocument,
  renameDocument,
  downloadDocument,
} from "@/lib/documents";

import { getNotes, createNote ,deleteNote} from "@/lib/notes";

import { cn } from "@/lib/utils";

import { useWorkspaceStore } from "@/store/workspaceStore";

import { DocumentMenu } from "./DocumentMenu";
import { RenameDocumentDialog } from "./RenameDocumentDialog";
import { DeleteDialog } from "./DeleteDialog";

interface WorkspaceSidebarProps {
  projectId: string;
}

export function WorkspaceSidebar({
  projectId,
}: WorkspaceSidebarProps) {
  const queryClient = useQueryClient();

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  const [uploadingFileName, setUploadingFileName] =
    useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [renameOpen, setRenameOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [selectedDocument, setSelectedDocument] =
  useState<Document | null>(null);
  const [selectedNote, setSelectedNote] =
  useState<Note | null>(null);

const [deleteNoteOpen, setDeleteNoteOpen] =
  useState(false);

  const { addTab, activeTabId ,closeTab} =
    useWorkspaceStore();

  const { data: documents = [] } = useQuery({
    queryKey: ["documents", projectId],
    queryFn: () => getDocuments(projectId),
  });

  const { data: notes = [] } = useQuery({
    queryKey: ["notes", projectId],
    queryFn: () => getNotes(projectId),
  });
  const filteredDocuments = documents.filter((doc) =>
  doc.title.toLowerCase().includes(search.toLowerCase()) ||
  doc.fileName.toLowerCase().includes(search.toLowerCase())
);

const filteredNotes = notes.filter((note) =>
  note.title.toLowerCase().includes(search.toLowerCase())
);
  const uploadMutation = useMutation({
    mutationFn: uploadDocument,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["documents", projectId],
      });

      setUploadingFileName(null);
    },

    onError: () => {
      setUploadingFileName(null);
    },
  });

  const createNoteMutation = useMutation({
    mutationFn: (data: {
      title: string;
      content: string;
    }) =>
      createNote(projectId, data),

    onSuccess: (note) => {
      queryClient.invalidateQueries({
        queryKey: ["notes", projectId],
      });

      addTab({
        id: `tab-${note.id}`,
        type: "note",
        documentId: note.id,
        title: note.title,
        icon: "sticky-note",
      });
    },
  });
const deleteNoteMutation = useMutation({
  mutationFn: deleteNote,

  onSuccess: (_, deletedNoteId) => {
    queryClient.invalidateQueries({
      queryKey: ["notes", projectId],
    });

    closeTab(`tab-${deletedNoteId}`);

    setDeleteNoteOpen(false);
    setSelectedNote(null);
  },
});

const deleteMutation = useMutation({
  mutationFn: deleteDocument,

  onSuccess: (_, deletedDocumentId) => {
    queryClient.invalidateQueries({
      queryKey: ["documents", projectId],
    });

    closeTab(`tab-${deletedDocumentId}`);

    setDeleteOpen(false);
    setSelectedDocument(null);
  },
});

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setUploadingFileName(file.name);

    uploadMutation.mutate({
      projectId,
      name: file.name,
      file,
    });
  };

  const openDocument = (
    document: Document
  ) => {
    addTab({
      id: `tab-${document.id}`,
      type: "document",
      documentId: document.id,
      title: document.title,
      icon: "file-text",
    });
  };

  const openNote = (
    note: Note
  ) => {
    addTab({
      id: `tab-${note.id}`,
      type: "note",
      documentId: note.id,
      title: note.title,
      icon: "sticky-note",
    });
  };

  return (

      <div className="w-[260px] border-r border-gray-200 bg-white flex flex-col h-full">
      <div className="p-3 border-b border-gray-200">
        <div className="relative mb-3">
          <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-gray-400" />

          <Input
  placeholder="Search..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  className="pl-8 h-8 text-xs"
/>
        </div>

        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-xs text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          All projects
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-500 uppercase">
              Documents
            </span>

            <span className="text-xs text-gray-400">
              {filteredDocuments.length}
            </span>
          </div>

          <div className="space-y-0.5">
            {filteredDocuments.map((doc) => (
 <div
  key={doc.id}
  className={cn(
    "group flex items-center justify-between rounded px-2 py-1.5",
      activeTabId === `tab-${doc.id}`
        ? "bg-primary-light"
        : "hover:bg-gray-100"
    )}
  >
    <div
  onClick={() => openDocument(doc)}
  className="flex min-w-0 flex-1 cursor-pointer items-start gap-2"
>
      <FileText className="mt-0.5 h-3.5 w-3.5 shrink-0" />

      <div className="min-w-0 flex-1 overflow-hidden">
        <p className="truncate text-xs font-medium">
          {doc.title}
        </p>

        <p className="truncate text-[10px] text-gray-400">
          {doc.fileName}
        </p>
      </div>
    </div>

    <DocumentMenu
      onRename={() => {
        setSelectedDocument(doc);
        setRenameOpen(true);
      }}
      onDownload={() => downloadDocument(doc.filePath)}
      onDelete={() => {
        setSelectedDocument(doc);
        setDeleteOpen(true);
      }}
    />
    
  </div>
))}
{search && filteredDocuments.length === 0 && (
    <p className="py-3 text-center text-xs text-gray-400">
      No documents found
    </p>
  )}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-500 uppercase">
              Notes
            </span>

            <span className="text-xs text-gray-400">
              {filteredNotes.length}
            </span>
          </div>

         <div className="space-y-1">
  {filteredNotes.map((note) => (
    <div
      key={note.id}
      className={cn(
        "group flex items-center justify-between rounded px-2 py-1.5",
        activeTabId === `tab-${note.id}`
          ? "bg-primary-light"
          : "hover:bg-gray-100"
      )}
    >
      <div
        onClick={() => openNote(note)}
        className="flex min-w-0 flex-1 cursor-pointer items-start gap-2"
      >
        <StickyNote className="mt-0.5 h-3.5 w-3.5 shrink-0" />

        <span className="truncate text-xs">
          {note.title}
        </span>
      </div>

      <NoteMenu
        onDelete={() => {
          setSelectedNote(note);
          setDeleteNoteOpen(true);
        }}
      />
    </div>
  ))}
  {search && filteredNotes.length === 0 && (
    <p className="py-3 text-center text-xs text-gray-400">
      No notes found
    </p>
  )}
</div>
        </div>
      </div>
            <div className="p-3 border-t border-gray-200 space-y-2">
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="hidden"
        />

        <Button
          size="sm"
          variant="outline"
          className="w-full justify-start"
          onClick={handleUploadClick}
          disabled={uploadMutation.isPending}
        >
          <Upload className="w-3.5 h-3.5 mr-2" />

          {uploadMutation.isPending
            ? `Uploading ${uploadingFileName}...`
            : "Upload PDF"}
        </Button>

        <Button
          size="sm"
          variant="outline"
          className="w-full justify-start"
          onClick={() =>
            createNoteMutation.mutate({
              title: "Untitled Note",
              content: "",
            })
          }
          disabled={createNoteMutation.isPending}
        >
          <Plus className="w-3.5 h-3.5 mr-2" />

          {createNoteMutation.isPending
            ? "Creating..."
            : "New Note"}
        </Button>
      </div>
      <RenameDocumentDialog
  open={renameOpen}
  initialTitle={selectedDocument?.title ?? ""}
  onClose={() => setRenameOpen(false)}
  onRename={(title) => {
    if (!selectedDocument) return;

    renameDocument(selectedDocument.id, title).then(() => {
      queryClient.invalidateQueries({
        queryKey: ["documents", projectId],
      });
    });
  }}
/>

<DeleteDialog
  open={deleteOpen}
  title="Delete Document"
  itemName={selectedDocument?.title ?? ""}
  onClose={() => setDeleteOpen(false)}
  onDelete={() => {
    if (!selectedDocument) return;

    deleteMutation.mutate(selectedDocument.id);
  }}
/>
<DeleteDialog
  open={deleteNoteOpen}
  title="Delete Note"
  itemName={selectedNote?.title ?? ""}
  onClose={() => setDeleteNoteOpen(false)}
  onDelete={() => {
    if (!selectedNote) return;

    deleteNoteMutation.mutate(selectedNote.id);
  }}
/>

    </div>
  );
}