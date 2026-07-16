"use client";

import { Bug } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export function ReportIssueCard() {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold">
            Report an Issue
          </h2>

          <p className="mt-2 text-sm text-gray-600">
            Found a bug or have a suggestion? We'd love to hear from you.
          </p>
        </div>

        <Bug className="h-6 w-6 text-red-500" />
      </div>

      <Button
        className="mt-6"
        onClick={() =>
          window.open(
            "mailto:ssridhiman2009@gmail.com",
            "_blank"
          )
        }
      >
        Contact Support
      </Button>
    </Card>
  );
}