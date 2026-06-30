"use client";

import { useState, useEffect } from "react";
import { SearchBar } from "@/features/search/SearchBar";
import { FilterRow } from "@/features/search/FilterRow";
import { AiAnswerBox } from "@/features/search/AiAnswerBox";
import { ResultsList } from "@/features/search/ResultsList";
import { useQuery } from "@tanstack/react-query";
import { semanticSearch } from "@/lib/search";
import { useSearchStore } from "@/store/searchStore";
import { useDebounce } from "@/hooks/useDebounce";

export default function SearchPage() {
  const { query, activeFilter } = useSearchStore();
  const debouncedQuery = useDebounce(query, 300);

  const { data, isLoading } = useQuery({
    queryKey: ["search", debouncedQuery, activeFilter],
    queryFn: () => semanticSearch(debouncedQuery, activeFilter),
    enabled: debouncedQuery.length > 2,
  });

  const handleSearch = () => {
    // Query will be triggered by the debouncedQuery change
  };

  const showResults = debouncedQuery.length > 2;

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <SearchBar onSearch={handleSearch} />

        {showResults && (
          <div className="mt-8">
            <FilterRow />

            <div className="mt-8">
              {data?.aiAnswer && <AiAnswerBox answer={data.aiAnswer} />}

              <div className="mb-4">
                <span className="text-sm text-gray-600">
                  {isLoading ? "Searching..." : `${data?.results.length || 0} results`}
                </span>
              </div>

              <ResultsList
                results={data?.results || []}
                isLoading={isLoading}
              />
            </div>
          </div>
        )}

        {!showResults && query.length > 0 && query.length <= 2 && (
          <div className="mt-8 text-center text-sm text-gray-500">
            Type at least 3 characters to search
          </div>
        )}
      </div>
    </div>
  );
}
