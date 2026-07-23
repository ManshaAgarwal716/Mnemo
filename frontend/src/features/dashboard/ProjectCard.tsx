"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FolderKanban,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Project } from "@/types";
import { formatRelativeTime } from "@/lib/utils";
import { useProjectModalStore } from "@/store/projectModalStore";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);

  const openEdit = useProjectModalStore((state) => state.openEdit);
  const openDelete = useProjectModalStore((state) => state.openDelete);
  console.log(project);

  return (
    <Card
      hover
      onClick={() => router.push(`/workspace/${project.id}`)}
      className="relative p-5"
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          setMenuOpen((prev) => !prev);
        }}
        className="absolute right-3 top-3 rounded-md p-1 hover:bg-gray-100"
      >
        <MoreVertical className="h-4 w-4 text-gray-500" />
      </button>

      {menuOpen && (
        <div className="absolute right-3 top-10 z-20 w-44 rounded-lg border border-gray-200 bg-white shadow-lg">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(false);
              openEdit(project);
            }}
            className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50"
          >
            <Pencil className="h-4 w-4" />
            Edit Project
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(false);
              openDelete(project);
            }}
            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
            Delete Project
          </button>
        </div>
      )}

      <div className="flex items-start gap-3">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded"
          style={{
            backgroundColor: project.color + "20",
          }}
        >
          <FolderKanban
            className="h-5 w-5"
            style={{
              color: project.color,
            }}
          />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="mb-1 truncate text-base font-medium text-gray-900">
            {project.name}
          </h3>

          <p className="mb-3 line-clamp-2 text-sm text-gray-600">
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