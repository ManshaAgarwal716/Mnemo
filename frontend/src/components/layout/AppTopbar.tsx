"use client";

import UserMenu from "./UserMenu";

export function AppTopbar() {
  return (
    <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-end px-6">
      <UserMenu />
    </header>
  );
}