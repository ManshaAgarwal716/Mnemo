"use client";

import { Search, X } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { useSearchStore } from "@/store/searchStore";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const { query, setQuery } = useSearchStore();

  const handleClear = () => {
    setQuery("");
    onSearch("");
  };

  return (
    <div className="relative max-w-3xl mx-auto">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            onSearch(e.target.value);
          }}
          placeholder="Search your research..."
          className="w-full pl-12 pr-32 py-4 text-base border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
          <Badge variant="primary">Semantic</Badge>
          {query && (
            <button
              onClick={handleClear}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
