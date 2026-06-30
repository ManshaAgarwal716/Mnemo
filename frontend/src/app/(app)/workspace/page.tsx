"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getProjects } from "@/lib/projects";
import { EmptyState } from "@/components/ui/EmptyState";
import { FolderKanban } from "lucide-react";

export default function WorkspacePage() {
  const router = useRouter();
  const { data: projects, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  useEffect(() => {
    if (!isLoading && projects && projects.length > 0) {
      router.replace(`/workspace/${projects[0].id}`);
    }
  }, [projects, isLoading, router]);

  if (isLoading) {
    return null;
  }

  return (
    <div className="h-full flex items-center justify-center">
      <EmptyState
        icon={FolderKanban}
        title="No projects yet"
        description="Create your first project to start organizing your research"
        actionLabel="Create project"
        onAction={() => router.push("/dashboard")}
      />
    </div>
  );
}
