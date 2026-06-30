"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Brain } from "lucide-react";

export function Topbar() {
  return (
    <nav className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center shadow-sm">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-semibold text-gray-900">Mnemo</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" className="hover:bg-gray-100">Sign in</Button>
          </Link>
          <Link href="/signup">
            <Button className="shadow-sm hover:shadow-md transition-shadow">Get started</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
