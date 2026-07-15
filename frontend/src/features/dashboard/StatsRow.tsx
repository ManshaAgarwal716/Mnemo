"use client";

import { useQuery } from "@tanstack/react-query";
import {
  FolderKanban,
  FileText,
  StickyNote,
  MessageSquare,
} from "lucide-react";

import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { getDashboard } from "@/lib/dashboard";

export function StatsRow() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboard,
  });

  if (isLoading) {
    return (
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <Card key={item} className="p-5">
            <Skeleton className="h-24 w-full" />
          </Card>
        ))}
      </div>
    );
  }

  const stats = [
    {
      label: "Projects",
      value: data?.stats.projects ?? 0,
      icon: FolderKanban,
      bg: "bg-purple-100",
      text: "text-purple-600",
    },
    {
      label: "Documents",
      value: data?.stats.documents ?? 0,
      icon: FileText,
      bg: "bg-blue-100",
      text: "text-blue-600",
    },
    {
      label: "Notes",
      value: data?.stats.notes ?? 0,
      icon: StickyNote,
      bg: "bg-yellow-100",
      text: "text-yellow-600",
    },
    {
      label: "Conversations",
      value: data?.stats.conversations ?? 0,
      icon: MessageSquare,
      bg: "bg-green-100",
      text: "text-green-600",
    },
  ];

  return (
    <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <Card
          key={stat.label}
          hover
          className="p-5 transition-all duration-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="mb-2 text-sm font-medium text-gray-500">
                {stat.label}
              </p>

              <h2 className="text-4xl font-bold text-gray-900">
                {stat.value}
              </h2>
            </div>

            <div
              className={`flex h-14 w-14 items-center justify-center rounded-2xl ${stat.bg}`}
            >
              <stat.icon
                className={`h-7 w-7 ${stat.text}`}
              />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}