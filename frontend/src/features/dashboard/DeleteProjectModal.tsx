"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Card } from "@/components/ui/Card";
import { deleteProject } from "@/lib/projects";
import { useProjectModalStore } from "@/store/projectModalStore";

export function DeleteProjectModal() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const isOpen = useProjectModalStore((state) => state.deleteOpen);
  const close = useProjectModalStore((state) => state.closeDelete);
  const project = useProjectModalStore((state) => state.selectedProject);

  const deleteMutation = useMutation({
    mutationFn: deleteProject,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["projects"],
      });

      close();

      router.push("/dashboard");
    },

    onError: (error) => {
      console.error(error);
    },
  });

  if (!isOpen || !project) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-md p-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Delete Project
        </h2>

        <p className="mt-3 text-sm text-gray-600">
          Are you sure you want to delete{" "}
          <span className="font-semibold">{project.name}</span>?
        </p>

        <p className="mt-2 text-sm text-red-500">
          This action cannot be undone.
        </p>

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={close}
            className="rounded-md px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={() => deleteMutation.mutate(project.id)}
            disabled={deleteMutation.isPending}
            className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-50"
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete"}
          </button>
        </div>
      </Card>
    </div>
  );
}