"use client";

import type { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Underline,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Quote,
  Code2,
  Undo2,
  Redo2,
} from "lucide-react";

interface Props {
  editor: Editor | null;
}

export function EditorToolbar({
  editor,
}: Props) {
  if (!editor) return null;

  const Button = ({
  active,
  disabled,
  onClick,
  children,
}: {
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    disabled={disabled}
    onClick={onClick}
    className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
      active
        ? "bg-primary text-white"
        : "hover:bg-gray-100 text-gray-700"
    } disabled:opacity-40 disabled:cursor-not-allowed`}
  >
    {children}
  </button>
);

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-gray-200 bg-white p-2">

      <Button
        active={editor.isActive("bold")}
        onClick={() =>
          editor.chain().focus().toggleBold().run()
        }
      >
        <Bold size={18} />
      </Button>

      <Button
        active={editor.isActive("italic")}
        onClick={() =>
          editor.chain().focus().toggleItalic().run()
        }
      >
        <Italic size={18} />
      </Button>

      <Button
        active={editor.isActive("underline")}
        onClick={() =>
          editor.chain().focus().toggleUnderline().run()
        }
      >
        <Underline size={18} />
      </Button>

      <div className="mx-1 h-6 w-px bg-gray-300" />

      <Button
        active={editor.isActive("heading", { level: 1 })}
        onClick={() =>
          editor
            .chain()
            .focus()
            .toggleHeading({ level: 1 })
            .run()
        }
      >
        <Heading1 size={18} />
      </Button>

      <Button
        active={editor.isActive("heading", { level: 2 })}
        onClick={() =>
          editor
            .chain()
            .focus()
            .toggleHeading({ level: 2 })
            .run()
        }
      >
        <Heading2 size={18} />
      </Button>

      <div className="mx-1 h-6 w-px bg-gray-300" />

      <Button
        active={editor.isActive("bulletList")}
        onClick={() =>
          editor.chain().focus().toggleBulletList().run()
        }
      >
        <List size={18} />
      </Button>

      <Button
        active={editor.isActive("orderedList")}
        onClick={() =>
          editor.chain().focus().toggleOrderedList().run()
        }
      >
        <ListOrdered size={18} />
      </Button>

      <Button
        active={editor.isActive("blockquote")}
        onClick={() =>
          editor.chain().focus().toggleBlockquote().run()
        }
      >
        <Quote size={18} />
      </Button>

      <Button
        active={editor.isActive("codeBlock")}
        onClick={() =>
          editor.chain().focus().toggleCodeBlock().run()
        }
      >
        <Code2 size={18} />
      </Button>

      <div className="mx-1 h-6 w-px bg-gray-300" />

     <Button
  disabled={!editor.can().undo()}
  onClick={() =>
    editor.chain().focus().undo().run()
  }
>
        <Undo2 size={18} />
      </Button>

      <Button
  disabled={!editor.can().redo()}
  onClick={() =>
    editor.chain().focus().redo().run()
  }
>
        <Redo2 size={18} />
      </Button>

    </div>
  );
}