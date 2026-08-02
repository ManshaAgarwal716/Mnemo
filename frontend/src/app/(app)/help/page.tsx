"use client";

import { GettingStarted } from "@/features/help/GettingStarted";
import { FaqSection } from "@/features/help/FaqSection";
import { AboutCard } from "@/features/help/AboutCard";
import { ReportIssueCard } from "@/features/help/ReportIssueCard";

export default function HelpPage() {
  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-6 p-8">
        <div>
          <h1 className="text-3xl font-bold">
            Help
          </h1>

          <p className="mt-2 text-gray-600">
            Learn how to use Mnemo and find answers to common questions.
          </p>
        </div>

        <GettingStarted />

        <FaqSection />

        <AboutCard />

        <ReportIssueCard />
        </div>
      </div>
    </div>
  );
}