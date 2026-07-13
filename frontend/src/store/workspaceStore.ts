import { create } from "zustand";
import { Tab } from "@/types";

interface WorkspaceState {
  activeProjectId: string | null;
  activeConversationId: string | null;

  tabs: Tab[];
  activeTabId: string | null;

  setActiveProject: (projectId: string) => void;
  setActiveConversation: (conversationId: string | null) => void;

  addTab: (tab: Tab) => void;
  closeTab: (tabId: string) => void;
  setActiveTab: (tabId: string) => void;
  clearTabs: () => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  activeProjectId: null,
  activeConversationId: null,
  tabs: [],
  activeTabId: null,

  setActiveProject: (projectId) => set({ activeProjectId: projectId }),
  setActiveConversation: (conversationId) =>
  set({ activeConversationId: conversationId }),

  addTab: (tab) =>
    set((state) => {
      // Check if tab already exists
      const existingTab = state.tabs.find((t) => t.documentId === tab.documentId);
      if (existingTab) {
        return { activeTabId: existingTab.id };
      }
      return {
        tabs: [...state.tabs, tab],
        activeTabId: tab.id,
      };
    }),

  closeTab: (tabId) =>
    set((state) => {
      const newTabs = state.tabs.filter((t) => t.id !== tabId);
      let newActiveTabId = state.activeTabId;

      if (state.activeTabId === tabId) {
        // Find next tab to activate
        const currentIndex = state.tabs.findIndex((t) => t.id === tabId);
        if (newTabs.length > 0) {
          newActiveTabId =
            newTabs[Math.min(currentIndex, newTabs.length - 1)].id;
        } else {
          newActiveTabId = null;
        }
      }

      return { tabs: newTabs, activeTabId: newActiveTabId };
    }),

  setActiveTab: (tabId) => set({ activeTabId: tabId }),

  clearTabs: () => set({ tabs: [], activeTabId: null }),
  
}));
