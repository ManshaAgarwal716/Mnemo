"use client";

import { useEffect, useState } from "react";

import { useMutation } from "@tanstack/react-query";

import { User } from "@/types";
import { useAuthStore } from "@/store/authStore";
import { updateProfile } from "@/lib/auth";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface ProfileCardProps {
  user: User;
}

export function ProfileCard({
  user,
}: ProfileCardProps) {
  const [name, setName] = useState(user.name);
  const [nameError, setNameError] = useState("");
  const updateUser = useAuthStore(
  (state) => state.updateUser,
);
  useEffect(() => {
    setName(user.name);
    setNameError("");
  }, [user]);

  const updateMutation = useMutation({
  mutationFn: () =>
    updateProfile({
      name: name.trim(),
    }),

  onSuccess: (updatedUser) => {
    updateUser(updatedUser);
  },
});

  const handleNameChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value;

    setName(value);

    if (value.trim().length === 0) {
      setNameError("Name is required.");
      return;
    }

    if (!/^[A-Za-z ]*$/.test(value)) {
      setNameError(
        "Name can only contain letters and spaces.",
      );
      return;
    }

    setNameError("");
  };

  return (
    <Card className="p-6">
      <h2 className="mb-6 text-lg font-semibold">
        Profile
      </h2>

      <div className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium">
            Name
          </label>

          <Input
            value={name}
            onChange={handleNameChange}
          />

          {nameError && (
            <p className="mt-2 text-sm text-red-500">
              {nameError}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Email
          </label>

          <Input
            value={user.email}
            disabled
          />
        </div>

        <div className="flex justify-end">
          <Button
            loading={updateMutation.isPending}
            disabled={
              !!nameError ||
              name.trim().length === 0
            }
            onClick={() =>
              updateMutation.mutate()
            }
          >
            Save Changes
          </Button>
        </div>
      </div>
    </Card>
  );
}