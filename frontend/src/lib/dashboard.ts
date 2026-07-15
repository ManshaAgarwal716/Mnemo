import api from "@/lib/api";

export interface DashboardStats {
  projects: number;
  documents: number;
  notes: number;
  conversations: number;
}

export interface ActivityItem {
  id: string;
  type: "project" | "document" | "note" | "conversation";
  name: string;
  subtitle: string;
  timestamp: string;
}

export interface DashboardResponse {
  stats: DashboardStats;
  recent_activity: ActivityItem[];
}

export async function getDashboard(): Promise<DashboardResponse> {
  const response = await api.get("/dashboard");
  return response.data;
}