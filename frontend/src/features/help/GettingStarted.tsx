"use client";

import { Card } from "@/components/ui/Card";

const steps = [
  "Create a new project from the Dashboard.",
  "Upload one or more PDF documents.",
  "Create notes while reading your documents.",
  "Use AI Assistant to ask questions about your research.",
  "Use Search to quickly find projects, notes and conversations.",
];

export function GettingStarted() {
  return (
    <Card className="p-6">
      <h2 className="mb-5 text-lg font-semibold">
        Getting Started
      </h2>

      <div className="space-y-4">
        {steps.map((step, index) => (
          <div
            key={step}
            className="flex items-start gap-4"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
              {index + 1}
            </div>

            <p className="pt-1 text-sm text-gray-700">
              {step}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}