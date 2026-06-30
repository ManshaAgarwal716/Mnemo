"use client";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { FileText } from "lucide-react";

const relatedDocs = [
  {
    id: "1",
    name: "BERT: Pre-training Deep Bidirectional Transformers",
    match: 87,
    snippet:
      "BERT is designed to pretrain deep bidirectional representations by jointly conditioning on both left and right context...",
  },
  {
    id: "2",
    name: "GPT-3: Language Models are Few-Shot Learners",
    match: 82,
    snippet:
      "Recent work has demonstrated substantial gains on many NLP tasks and benchmarks by pre-training on a large corpus of text...",
  },
  {
    id: "3",
    name: "My research notes on self-attention",
    match: 76,
    snippet:
      "Self-attention mechanisms allow the model to weigh the importance of different parts of the input when processing each element...",
  },
];

export function RelatedTab() {
  return (
    <div className="p-4 space-y-3 overflow-y-auto">
      {relatedDocs.map((doc) => (
        <Card key={doc.id} hover className="p-4 cursor-pointer">
          <div className="flex items-start gap-2 mb-2">
            <FileText className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
                  {doc.name}
                </h4>
                <Badge variant="outline" size="sm">
                  {doc.match}%
                </Badge>
              </div>
              <p className="text-xs text-gray-600 line-clamp-2">{doc.snippet}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
