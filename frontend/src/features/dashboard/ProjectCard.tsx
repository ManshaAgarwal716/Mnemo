"use client";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Project } from "@/types";
import { FolderKanban } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const router = useRouter();

  return (
    <Card
      hover
      onClick={() => router.push(`/workspace/${project.id}`)}
      className="p-5"
    >
      <div className="flex items-start gap-3">
        <div
          className="w-10 h-10 rounded flex items-center justify-center shrink-0"
          style={{ backgroundColor: project.color + "20" }}
        >
          <FolderKanban
            className="w-5 h-5"
            style={{ color: project.color }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-medium text-gray-900 mb-1 truncate">
            {project.name}
          </h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {project.description}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {project.tags?.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="gray">
                  {tag}
                </Badge>
              ))}
            </div>
            <span className="text-xs text-gray-500">
              {formatRelativeTime(project.updatedAt)}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
