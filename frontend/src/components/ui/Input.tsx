import React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          ref={ref}
          className={cn(
            "w-full px-4 py-2.5 text-sm border rounded-lg bg-white transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent focus:shadow-sm",
            "disabled:bg-gray-50 disabled:text-gray-500",
            error ? "border-red-500 focus:ring-red-500" : "border-gray-300 hover:border-gray-400",
            className
          )}
          {...props}
        />
        {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
