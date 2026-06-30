import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  variant?: "primary" | "teal" | "amber" | "gray" | "outline";
  size?: "sm" | "md";
  children: React.ReactNode;
  className?: string;
}

export function Badge({
  variant = "gray",
  size = "sm",
  children,
  className,
}: BadgeProps) {
  const baseStyles = "inline-flex items-center rounded font-medium";

  const variants = {
    primary: "bg-primary-light text-primary border border-primary-border",
    teal: "bg-teal-light text-teal border border-teal",
    amber: "bg-amber-light text-amber border border-amber",
    gray: "bg-gray-100 text-gray-700 border border-gray-200",
    outline: "bg-white text-gray-600 border border-gray-300",
  };

  const sizes = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
  };

  return (
    <span className={cn(baseStyles, variants[variant], sizes[size], className)}>
      {children}
    </span>
  );
}
