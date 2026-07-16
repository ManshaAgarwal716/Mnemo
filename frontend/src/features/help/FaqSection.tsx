"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

import { Card } from "@/components/ui/Card";

const faqs = [
  {
    question: "How do I create a project?",
    answer:
      "Click the 'New Project' button from the Dashboard or the Workspace sidebar. Give your project a name, description and color to get started.",
  },
  {
    question: "How do I upload PDF documents?",
    answer:
      "Open a project, then use the Upload button in the Workspace sidebar to upload one or more PDF files.",
  },
  {
    question: "How can I chat with my documents?",
    answer:
      "Open the AI Assistant from the sidebar or inside a project. Start a new conversation and ask questions about your uploaded documents.",
  },
  {
    question: "Can I edit PDF documents?",
    answer:
      "No. Uploaded PDFs are read-only. You can create notes alongside them while reading.",
  },
  {
    question: "What can I search for?",
    answer:
      "Search supports projects, documents, notes and AI conversations from one place.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <Card className="p-6">
      <h2 className="mb-6 text-lg font-semibold">
        Frequently Asked Questions
      </h2>

      <div className="space-y-3">
        {faqs.map((faq, index) => {
          const open = openIndex === index;

          return (
            <div
              key={faq.question}
              className="rounded-xl border border-gray-200"
            >
              <button
                onClick={() =>
                  setOpenIndex(open ? null : index)
                }
                className="flex w-full items-center justify-between px-5 py-4 text-left transition hover:bg-gray-50"
              >
                <span className="font-medium text-gray-900">
                  {faq.question}
                </span>

                {open ? (
                  <Minus className="h-5 w-5 text-gray-500" />
                ) : (
                  <Plus className="h-5 w-5 text-gray-500" />
                )}
              </button>

              {open && (
                <div className="border-t border-gray-100 px-5 py-4">
                  <p className="text-sm leading-6 text-gray-600">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}