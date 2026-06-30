"use client";

import { DashboardHeader } from "@/features/dashboard/DashboardHeader";
import { StatsRow } from "@/features/dashboard/StatsRow";
import { ProjectsGrid } from "@/features/dashboard/ProjectsGrid";
import { RecentActivity } from "@/features/dashboard/RecentActivity";

export default function DashboardPage() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-6xl mx-auto p-8">
        <DashboardHeader />
        <StatsRow />
        
        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Projects</h2>
          <ProjectsGrid />
        </div>

        <div className="mb-6">
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}
