import { create } from "zustand";

interface SearchState {
  query: string;
  activeFilter: string;
  setQuery: (query: string) => void;
  setActiveFilter: (filter: string) => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  query: "",
  activeFilter: "all",
  setQuery: (query) => set({ query }),
  setActiveFilter: (filter) => set({ activeFilter: filter }),
}));
