"use client";

import { useEffect } from "react";
import {
  EditorContent,
  useEditor,
} from "@tiptap/react";

import { editorExtensions } from "./extensions";
import { EditorToolbar } from "./EditorToolbar";

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
}

export function Editor({
  content,
  onChange,
}: EditorProps) {
  const editor = useEditor({
    extensions: editorExtensions,

    content,

    immediatelyRender: false,

    editorProps: {
      attributes: {
        class:
"min-h-[600px] px-8 py-6 text-[15px] leading-8 focus:outline-none"
      },
    },

    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (
      editor &&
      content !== editor.getHTML()
    ) {
      editor.commands.setContent(
        content || "",
      );
    }
  }, [content, editor]);

  if (!editor) return null;

  return (
    <div className="flex h-full flex-col rounded-lg border border-gray-200 bg-white">

      <EditorToolbar editor={editor} />

      <div className="flex-1 overflow-y-auto">
        <EditorContent
          editor={editor}
        />
      </div>

    </div>
  );
}