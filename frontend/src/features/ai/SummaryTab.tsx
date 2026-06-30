"use client";

import { Card } from "@/components/ui/Card";
import { FileText, Brain, Link2 } from "lucide-react";

const summaries = [
  {
    icon: FileText,
    title: "Document overview",
    points: [
      "Introduces the Transformer architecture for NLP",
      "Proposes attention mechanisms as replacement for RNNs",
      "Achieves state-of-the-art results on translation tasks",
    ],
  },
  {
    icon: Brain,
    title: "Key concepts",
    points: [
      "Self-attention allows parallel processing of sequences",
      "Multi-head attention captures different representation subspaces",
      "Positional encoding maintains sequence order information",
    ],
  },
  {
    icon: Link2,
    title: "Connections",
    points: [
      "Related to BERT's bidirectional attention approach",
      "Foundation for GPT series of models",
      "Influenced by earlier attention work in neural machine translation",
    ],
  },
];

export function SummaryTab() {
  return (
    <div className="p-4 space-y-3 overflow-y-auto">
      {summaries.map((summary) => (
        <Card key={summary.title} className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded bg-primary-light flex items-center justify-center">
              <summary.icon className="w-4 h-4 text-primary" />
            </div>
            <h3 className="text-sm font-medium text-gray-900">{summary.title}</h3>
          </div>
          <ul className="space-y-2">
            {summary.points.map((point, index) => (
              <li key={index} className="text-xs text-gray-700 flex gap-2">
                <span className="text-gray-400">•</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </Card>
      ))}
    </div>
  );
}
