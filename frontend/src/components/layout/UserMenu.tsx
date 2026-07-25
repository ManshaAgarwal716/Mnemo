"use client";

import { useRouter } from "next/navigation";
import { HelpCircle, LogOut, Settings } from "lucide-react";

import { useAuthStore } from "@/store/authStore";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function UserMenu() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const router = useRouter();

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white font-semibold">
          {user?.name?.charAt(0).toUpperCase()}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-64 overflow-hidden">
        {/* User Info */}
        <div className="px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white font-semibold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">
                {user?.name}
              </p>

              <p className="truncate text-xs text-gray-500">
                {user?.email}
              </p>
            </div>
          </div>
        </div>

        <div className="h-px bg-gray-200" />

        <DropdownMenuItem onClick={() => router.push("/settings")}>
          <Settings size={16} />
          <span>Settings</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => router.push("/help")}>
          <HelpCircle size={16} />
          <span>Help</span>
        </DropdownMenuItem>

        <div className="h-px bg-gray-200" />

        <DropdownMenuItem
          onClick={handleLogout}
          className="text-red-600 hover:bg-red-50"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}