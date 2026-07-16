"use client";

import { GettingStarted } from "@/features/help/GettingStarted";
import { FaqSection } from "@/features/help/FaqSection";
import { AboutCard } from "@/features/help/AboutCard";
import { ReportIssueCard } from "@/features/help/ReportIssueCard";

export default function HelpPage() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-4xl space-y-6 p-8">
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
  );
}