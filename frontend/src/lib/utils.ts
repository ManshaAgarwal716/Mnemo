import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRelativeTime(dateString: string): string {
  const date = new Date(
  dateString.endsWith("Z")
    ? dateString
    : `${dateString}Z`
);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return date.toLocaleDateString();
}

export function groupConversationsByDate(conversations: any[]) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const groups: { [key: string]: any[] } = {
    Today: [],
    Yesterday: [],
    Earlier: [],
  };

  conversations.forEach((conv) => {
    const convDate = new Date(conv.updatedAt);
    const convDay = new Date(
      convDate.getFullYear(),
      convDate.getMonth(),
      convDate.getDate()
    );

    if (convDay.getTime() === today.getTime()) {
      groups.Today.push(conv);
    } else if (convDay.getTime() === yesterday.getTime()) {
      groups.Yesterday.push(conv);
    } else {
      groups.Earlier.push(conv);
    }
  });

  return groups;
}
