"use client";

import { useQuery } from "@tanstack/react-query";
import { FileText, Brain, CheckCircle, HelpCircle } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { getSummary } from "@/lib/chat";

interface SummaryTabProps {
  conversationId: string;
}

export function SummaryTab({
  conversationId,
}: SummaryTabProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["summary", conversationId],
    queryFn: () => getSummary(conversationId),
  });

  if (isLoading) {
    return (
      <div className="p-4 text-sm text-gray-500">
        Generating summary...
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const sections = [
    {
      title: "Overview",
      icon: FileText,
      content: data.overview
        ? [data.overview]
        : [],
    },
    {
      title: "Key Ideas",
      icon: Brain,
      content: data.key_ideas,
    },
    {
      title: "Important Concepts",
      icon: Brain,
      content: data.important_concepts,
    },
    {
      title: "Action Items",
      icon: CheckCircle,
      content: data.action_items,
    },
    {
      title: "Questions Remaining",
      icon: HelpCircle,
      content: data.questions_remaining,
    },
  ];

  return (
    <div className="space-y-3 overflow-y-auto p-4">
      {sections.map((section) => {
        if (!section.content?.length) {
          return null;
        }

        return (
          <Card
            key={section.title}
            className="p-4"
          >
            <div className="mb-3 flex items-center gap-2">
              <section.icon className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-medium">
                {section.title}
              </h3>
            </div>

            <ul className="space-y-2">
              {section.content.map((item, index) => (
                <li
                  key={index}
                  className="flex gap-2 text-xs text-gray-700"
                >
                  <span>•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        );
      })}
    </div>
  );
}