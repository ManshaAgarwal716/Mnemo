"use client";

import { useAuthStore } from "@/store/authStore";

export function DashboardHeader() {
  const user = useAuthStore((state) => state.user);
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="mb-8">
      <h1 className="text-2xl font-medium text-gray-900 mb-1">
        {getGreeting()}, {user?.name?.split(" ")[0] || "there"}
      </h1>
      <p className="text-sm text-gray-600">
        Here's what's happening with your research today
      </p>
    </div>
  );
}
