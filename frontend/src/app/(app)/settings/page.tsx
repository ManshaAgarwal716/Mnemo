"use client";

import { useQuery } from "@tanstack/react-query";

import { getCurrentUser } from "@/lib/auth";

import { ProfileCard } from "@/features/settings/ProfileCard";
import { PasswordCard } from "@/features/settings/PasswordCard";
import { DangerZone } from "@/features/settings/DangerZone";

import { Skeleton } from "@/components/ui/Skeleton";

export default function SettingsPage() {
  const {
    data: user,
    isLoading,
  } = useQuery({
    queryKey: ["me"],
    queryFn: getCurrentUser,
  });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl space-y-6 p-8">
        <Skeleton className="h-48 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
        <Skeleton className="h-44 rounded-xl" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-3xl p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Settings
          </h1>

          <p className="mt-2 text-gray-600">
            Manage your account and security.
          </p>
        </div>

        <div className="space-y-6">
          <ProfileCard user={user} />

          <PasswordCard />

          <DangerZone />
        </div>
      </div>
    </div>
  );
}