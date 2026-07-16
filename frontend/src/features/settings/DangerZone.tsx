"use client";

import { useRouter } from "next/navigation";

import { LogOut, Trash2 } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

import { logout } from "@/lib/auth";
import { useAuthStore } from "@/store/authStore";

export function DangerZone() {
  const router = useRouter();

  const clearAuth = useAuthStore(
    (state) => state.logout
  );

  const handleLogout = () => {
    logout();

    clearAuth();

    router.replace("/login");
  };

  return (
    <Card className="border-red-200 p-6">
      <h2 className="mb-2 text-lg font-semibold text-red-600">
        Danger Zone
      </h2>

      <p className="mb-6 text-sm text-gray-600">
        These actions affect your account.
      </p>

      <div className="flex flex-col gap-3">
        <Button
          variant="outline"
          onClick={handleLogout}
          className="justify-start"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>

        <Button
          variant="outline"
          disabled
          className="justify-start border-red-200 text-red-600 hover:bg-red-50"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Account
          <span className="ml-auto text-xs">
            Coming Soon
          </span>
        </Button>
      </div>
    </Card>
  );
}