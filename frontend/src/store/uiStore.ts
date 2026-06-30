import { create } from "zustand";

interface UiState {
  sidebarCollapsed: boolean;
  activeAiTab: "chat" | "summary" | "related";
  setSidebarCollapsed: (collapsed: boolean) => void;
  setActiveAiTab: (tab: "chat" | "summary" | "related") => void;
}

export const useUiStore = create<UiState>((set) => ({
  sidebarCollapsed: false,
  activeAiTab: "chat",
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  setActiveAiTab: (tab) => set({ activeAiTab: tab }),
}));
