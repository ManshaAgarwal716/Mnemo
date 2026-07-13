import { create } from "zustand";
import { Project } from "@/types";

interface ProjectModalStore {
  createOpen: boolean;
  editOpen: boolean;
  deleteOpen: boolean;

  selectedProject: Project | null;

  openCreate: () => void;
  closeCreate: () => void;

  openEdit: (project: Project) => void;
  closeEdit: () => void;

  openDelete: (project: Project) => void;
  closeDelete: () => void;
}

export const useProjectModalStore = create<ProjectModalStore>((set) => ({
  createOpen: false,
  editOpen: false,
  deleteOpen: false,

  selectedProject: null,

  openCreate: () =>
    set({
      createOpen: true,
    }),

  closeCreate: () =>
    set({
      createOpen: false,
    }),

  openEdit: (project) =>
    set({
      editOpen: true,
      selectedProject: project,
    }),

  closeEdit: () =>
    set({
      editOpen: false,
      selectedProject: null,
    }),

  openDelete: (project) =>
    set({
      deleteOpen: true,
      selectedProject: project,
    }),

  closeDelete: () =>
    set({
      deleteOpen: false,
      selectedProject: null,
    }),
}));