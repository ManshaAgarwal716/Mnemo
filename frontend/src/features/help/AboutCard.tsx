"use client";

import { Card } from "@/components/ui/Card";

export function AboutCard() {
  return (
    <Card className="p-6">
      <h2 className="mb-5 text-lg font-semibold">
        About Mnemo
      </h2>

      <div className="space-y-2 text-sm text-gray-700">
        <p>
          <strong>Version:</strong> 1.0.0
        </p>

        <p>
          <strong>Frontend:</strong> Next.js
        </p>

        <p>
          <strong>Backend:</strong> FastAPI
        </p>

        <p>
          <strong>Database:</strong> PostgreSQL
        </p>

        <p>
          <strong>AI:</strong> Google Gemini
        </p>
      </div>
    </Card>
  );
}