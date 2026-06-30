"use client";

import { SearchResult } from "@/types";
import { ResultCard } from "./ResultCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Search } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";

interface ResultsListProps {
  results: SearchResult[];
  isLoading: boolean;
}

export function ResultsList({ results, isLoading }: ResultsListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 w-full rounded-card" />
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <EmptyState
        icon={Search}
        title="No results found"
        description="Try adjusting your search query or filters to find what you're looking for"
      />
    );
  }

  return (
    <div className="space-y-4">
      {results.map((result) => (
        <ResultCard key={result.id} result={result} />
      ))}
    </div>
  );
}
