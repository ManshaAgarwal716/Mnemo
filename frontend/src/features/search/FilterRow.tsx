"use client";

import { cn } from "@/lib/utils";
import { useSearchStore } from "@/store/searchStore";

const filters = [
  {
    id: "all",
    label: "All",
  },
  {
    id: "project",
    label: "Projects",
  },
  {
    id: "document",
    label: "Documents",
  },
  {
    id: "note",
    label: "Notes",
  },
  {
    id: "conversation",
    label: "Conversations",
  },
];

export function FilterRow() {
  const {
    activeFilter,
    setActiveFilter,
  } = useSearchStore();

  return (
    <div className="mb-6 flex flex-wrap gap-3">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() =>
            setActiveFilter(filter.id)
          }
          className={cn(
            "rounded-full border px-4 py-2 text-sm font-medium transition-all",
            activeFilter === filter.id
              ? "border-primary bg-primary text-white"
              : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
          )}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}