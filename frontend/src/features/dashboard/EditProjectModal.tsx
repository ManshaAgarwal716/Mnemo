"use client";

import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Card } from "@/components/ui/Card";
import { updateProject } from "@/lib/projects";
import { useProjectModalStore } from "@/store/projectModalStore";

export function EditProjectModal() {
  const queryClient = useQueryClient();

  const isOpen = useProjectModalStore((state) => state.editOpen);
  const close = useProjectModalStore((state) => state.closeEdit);
  const project = useProjectModalStore((state) => state.selectedProject);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#3B82F6");

  useEffect(() => {
    if (project) {
      setName(project.name);
      setDescription(project.description);
      setColor(project.color);
    }
  }, [project]);

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: {
        name: string;
        description: string;
        color: string;
      };
    }) => updateProject(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });

      if (project) {
        queryClient.invalidateQueries({
          queryKey: ["project", project.id],
        });
      }

      close();
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
        <h2 className="mb-5 text-xl font-semibold">
          Edit Project
        </h2>

        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();

            updateMutation.mutate({
              id: project.id,
              data: {
                name,
                description,
                color,
              },
            });
          }}
        >
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Name
            </label>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Description
            </label>

            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Color
            </label>

            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="h-10 w-full cursor-pointer rounded-md border border-gray-300"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={close}
              className="rounded-md px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="rounded-md bg-primary px-4 py-2 text-white hover:bg-primary-hover disabled:opacity-50"
            >
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}