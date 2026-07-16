"use client";

import { useState } from "react";

import { useMutation } from "@tanstack/react-query";

import { changePassword } from "@/lib/auth";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function PasswordCard() {
  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const mutation = useMutation({
    mutationFn: () =>
      changePassword({
        current_password: currentPassword,
        new_password: newPassword,
      }),

    onSuccess: () => {
      setCurrentPassword("");
      setNewPassword("");
    },
  });

  return (
    <Card className="p-6">
      <h2 className="mb-6 text-lg font-semibold">
        Security
      </h2>

      <div className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium">
            Current Password
          </label>

          <Input
            type="password"
            value={currentPassword}
            onChange={(e) =>
              setCurrentPassword(
                e.target.value
              )
            }
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            New Password
          </label>

          <Input
            type="password"
            value={newPassword}
            onChange={(e) =>
              setNewPassword(
                e.target.value
              )
            }
          />
        </div>

        <div className="flex justify-end">
          <Button
            loading={mutation.isPending}
            onClick={() =>
              mutation.mutate()
            }
          >
            Change Password
          </Button>
        </div>
      </div>
    </Card>
  );
}