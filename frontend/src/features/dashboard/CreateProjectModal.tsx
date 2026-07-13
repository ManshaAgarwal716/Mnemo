"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Card } from "@/components/ui/Card";
import { createProject } from "@/lib/projects";
import { Project } from "@/types";
import { useProjectModalStore } from "@/store/projectModalStore";

export function CreateProjectModal() {
  const router = useRouter();
  const queryClient = useQueryClient();

 const isOpen = useProjectModalStore((state) => state.createOpen);
  const close = useProjectModalStore((state) => state.closeCreate);

  const createMutation = useMutation({
    mutationFn: createProject,

    onSuccess: (project: Project) => {
      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });

      close();

      router.push(`/workspace/${project.id}`);
    },

    onError: (error) => {
      console.error(error);
    },
  });

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-md p-6">
        <h2 className="mb-4 text-lg font-semibold">
          Create New Project
        </h2>

        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();

            const formData = new FormData(e.currentTarget);

            createMutation.mutate({
              name: formData.get("name") as string,
              description: formData.get("description") as string,
              color: formData.get("color") as string,
            });
          }}
        >
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Name
            </label>

            <input
              name="name"
              required
              type="text"
              placeholder="Project name"
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Description
            </label>

            <textarea
              name="description"
              required
              rows={3}
              placeholder="Project description"
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Color
            </label>

            <input
              name="color"
              type="color"
              defaultValue="#3B82F6"
              className="h-10 w-full cursor-pointer rounded-md border border-gray-300"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={close}
              className="rounded-md px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={createMutation.isPending}
              className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {createMutation.isPending ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}