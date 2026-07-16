"use client";

import { useEffect, useState } from "react";

import {
  useMutation,
} from "@tanstack/react-query";

import {
  User,
} from "@/types";

import {
  updateProfile,
} from "@/lib/auth";

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

  useEffect(() => {
    setName(user.name);
  }, [user]);

  const updateMutation = useMutation({
    mutationFn: () =>
      updateProfile({
        name,
      }),
  });

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
            onChange={(e) =>
              setName(e.target.value)
            }
          />
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