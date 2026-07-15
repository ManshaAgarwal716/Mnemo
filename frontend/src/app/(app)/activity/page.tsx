"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { RecentActivity } from "@/features/dashboard/RecentActivity";

export default function ActivityPage() {
  const router = useRouter();

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-5xl p-8">
        <button
          onClick={() => router.push("/dashboard")}
          className="mb-6 flex items-center gap-2 text-sm text-gray-600 hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </button>

        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          Activity
        </h1>

        <p className="mb-8 text-gray-600">
          Everything you've recently worked on.
        </p>

        <RecentActivity showHeader={false} />
      </div>
    </div>
  );
}