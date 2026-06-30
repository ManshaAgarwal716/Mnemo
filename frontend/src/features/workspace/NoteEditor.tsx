"use client";

import { Textarea } from "@/components/ui/Textarea";
import { Input } from "@/components/ui/Input";
import { useState } from "react";

export function NoteEditor() {
  const [title, setTitle] = useState("My research notes on self-attention");
  const [content, setContent] = useState(
    "Self-attention mechanisms allow the model to weigh the importance of different parts of the input when processing each element. This is fundamentally different from RNNs which process sequentially.\n\nKey concepts:\n- Query, Key, Value matrices\n- Scaled dot-product attention\n- Multi-head attention for parallel processing"
  );

  return (
    <div className="flex-1 flex flex-col bg-white">
      <div className="border-b border-gray-200 p-4">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-lg font-medium border-0 focus:ring-0 px-0"
          placeholder="Untitled note"
        />
      </div>
      <div className="flex-1 p-6">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-full border-0 focus:ring-0 resize-none text-sm"
          placeholder="Start writing..."
        />
      </div>
    </div>
  );
}
