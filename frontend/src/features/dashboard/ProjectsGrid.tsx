"use client";

import { useQuery } from "@tanstack/react-query";
import { getProjects } from "@/lib/projects";
import { ProjectCard } from "./ProjectCard";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { FolderKanban, Plus } from "lucide-react";
import { useProjectModalStore } from "@/store/projectModalStore";

export function ProjectsGrid() {
const open = useProjectModalStore((state) => state.openCreate);

  const { data: projects, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-5">
            <div className="flex gap-3">
              <Skeleton className="w-10 h-10 rounded" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <EmptyState
        icon={FolderKanban}
        title="No projects yet"
        description="Create your first project to start organizing your research"
        actionLabel="Create project"
        onAction={open}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}

      <Card
        hover
        onClick={open}
        className="p-5 border-dashed border-2 flex items-center justify-center min-h-[140px]"
      >
        <div className="text-center">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-2">
            <Plus className="w-5 h-5 text-gray-600" />
          </div>
          <p className="text-sm font-medium text-gray-700">
            New project
          </p>
        </div>
      </Card>
    </div>
  );
}