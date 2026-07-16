"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FolderKanban,
  MessageSquare,
  Search,
  Plus,
  Settings,
  HelpCircle,
  Brain,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { useQuery } from "@tanstack/react-query";
import { getProjects } from "@/lib/projects";
import { useProjectModalStore } from "@/store/projectModalStore";
import { useWorkspaceStore } from "@/store/workspaceStore";
const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Workspace", href: "/workspace", icon: FolderKanban },
  { label: "Search", href: "/search", icon: Search },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: projects = [] } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });
const open = useProjectModalStore((state) => state.openCreate);
  return (
    <aside className="w-56 border-r border-gray-200 bg-white flex flex-col h-screen">
      <div className="p-4 border-b border-gray-200">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-medium text-gray-900">Mnemo</span>
        </Link>
      </div>

      <nav className="flex-1 p-3 overflow-y-auto">
        <div className="space-y-1 mb-6">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary-light text-primary"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
          <Link
   href="/ai"
  className={cn(
    "flex items-center gap-3 px-3 py-2 rounded text-sm font-medium transition-colors",
    pathname.includes("/ai")
      ? "bg-primary-light text-primary"
      : "text-gray-700 hover:bg-gray-100"
  )}
>
  <MessageSquare className="w-4 h-4" />
  AI Assistant
</Link>
        </div>

        <div>
          <div className="flex items-center justify-between px-3 mb-2">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Projects
            </span>
          </div>
          <div className="space-y-1">
            {projects.slice(0, 5).map((project) => (
              <Link
                key={project.id}
                href={`/workspace/${project.id}`}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded text-sm transition-colors",
                  pathname.includes(project.id)
                    ? "bg-primary-light text-primary"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <div
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: project.color }}
                />
                <span className="truncate flex-1">{project.name}</span>
                <Badge variant="gray" className="text-xs">
                  {project.documentCount}
                </Badge>
              </Link>
            ))}
          </div>
          <button
  onClick={open}
  className="flex w-full items-center gap-2 px-3 py-2 mt-2 text-sm text-primary hover:bg-primary-light rounded transition-colors"
>
  <Plus className="w-4 h-4" />
  New project
</button>
        </div>
      </nav>

      <div className="p-3 border-t border-gray-200 space-y-1">
       <div className="p-3 border-t border-gray-200 space-y-1">
  <Link
    href="/settings"
    className={cn(
      "flex items-center gap-3 px-3 py-2 rounded text-sm font-medium transition-colors",
      pathname === "/settings"
        ? "bg-primary-light text-primary"
        : "text-gray-700 hover:bg-gray-100"
    )}
  >
    <Settings className="w-4 h-4" />
    Settings
  </Link>

  <Link
    href="/help"
    className={cn(
      "flex items-center gap-3 px-3 py-2 rounded text-sm font-medium transition-colors",
      pathname === "/help"
        ? "bg-primary-light text-primary"
        : "text-gray-700 hover:bg-gray-100"
    )}
  >
    <HelpCircle className="w-4 h-4" />
    Help
  </Link>
</div>
      </div>
    </aside>
  );
}
