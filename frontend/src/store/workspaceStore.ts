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
  openDocument: (documentId: string, title: string) => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  activeProjectId: null,
  activeConversationId: null,
  tabs: [],
  activeTabId: null,

  setActiveProject: (projectId) => set({ activeProjectId: projectId }),
  setActiveConversation: (conversationId) =>
  set((state) => {
    if (
      state.activeConversationId === conversationId
    ) {
      return state;
    }

    return {
      activeConversationId: conversationId,
    };
  }),

  addTab: (tab) =>
    set((state) => {
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
  openDocument: (documentId, title) =>
  set((state) => {
    const existingTab = state.tabs.find(
      (tab) => tab.documentId === documentId
    );

    if (existingTab) {
      return {
        activeTabId: existingTab.id,
      };
    }

    const newTab: Tab = {
      id: crypto.randomUUID(),
      type: "document",
      documentId,
      title,
      icon: "file-text",
    };

    return {
      tabs: [...state.tabs, newTab],
      activeTabId: newTab.id,
    };
  }),
  
}));
