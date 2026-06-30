"use client";

import { cn } from "@/lib/utils";
import { useSearchStore } from "@/store/searchStore";
import { useQuery } from "@tanstack/react-query";
import { getProjects } from "@/lib/projects";

const defaultFilters = [
  { id: "all", label: "All" },
  { id: "pdfs", label: "PDFs" },
  { id: "notes", label: "Notes" },
  { id: "conversations", label: "Conversations" },
];

export function FilterRow() {
  const { activeFilter, setActiveFilter } = useSearchStore();
  const { data: projects = [] } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  const projectFilters = projects.slice(0, 3).map((p) => ({
    id: p.id,
    label: p.name,
  }));

  const allFilters = [...defaultFilters, ...projectFilters];

  return (
    <div className="flex flex-wrap gap-2">
      {allFilters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => setActiveFilter(filter.id)}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-colors",
            activeFilter === filter.id
              ? "bg-primary text-white"
              : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
          )}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
