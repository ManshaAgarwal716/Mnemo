"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { CreateProjectModal } from "@/features/dashboard/CreateProjectModal";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { EditProjectModal } from "@/features/dashboard/EditProjectModal";
import { DeleteProjectModal } from "@/features/dashboard/DeleteProjectModal";
interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <main className="flex-1 overflow-hidden">
        {children}
      </main>
      <CreateProjectModal />
      <EditProjectModal />
      <DeleteProjectModal />
    </div>
  );
}