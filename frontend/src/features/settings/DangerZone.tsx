"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { LogOut, Trash2 } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

import {
  logout,
  deleteAccount,
} from "@/lib/auth";

import { useAuthStore } from "@/store/authStore";

export function DangerZone() {
  const router = useRouter();

  const clearAuth = useAuthStore(
    (state) => state.logout
  );

  const [showDelete, setShowDelete] =
    useState(false);

  const [password, setPassword] =
    useState("");

  const logoutHandler = async () => {
    await logout();

    clearAuth();

    router.replace("/login");
  };

  const deleteMutation = useMutation({
    mutationFn: () =>
      deleteAccount(password),

    onSuccess: async () => {
      await logout();

      clearAuth();

      router.replace("/login");
    },
  });

  return (
    <Card className="border-red-200 p-6">
      <h2 className="mb-2 text-lg font-semibold text-red-600">
        Danger Zone
      </h2>

      <p className="mb-6 text-sm text-gray-600">
        These actions permanently affect your account.
      </p>

      <div className="space-y-3">

        <Button
          variant="outline"
          onClick={logoutHandler}
          className="justify-start"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>

        {!showDelete ? (
          <Button
            variant="outline"
            className="justify-start border-red-300 text-red-600 hover:bg-red-50"
            onClick={() =>
              setShowDelete(true)
            }
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Account
          </Button>
        ) : (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4">

            <p className="mb-4 text-sm text-red-700">
              This action cannot be undone.
              All projects, documents,
              notes and AI conversations
              will be permanently deleted.
            </p>

            <Input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
            />

            <div className="mt-4 flex justify-end gap-2">

              <Button
                variant="ghost"
                onClick={() => {
                  setShowDelete(false);
                  setPassword("");
                }}
              >
                Cancel
              </Button>

              <Button
                loading={
                  deleteMutation.isPending
                }
                onClick={() =>
                  deleteMutation.mutate()
                }
              >
                Delete Account
              </Button>

            </div>

          </div>
        )}

      </div>
    </Card>
  );
}