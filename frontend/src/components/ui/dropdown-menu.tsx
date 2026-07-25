"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

type DropdownContextType = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const DropdownContext =
  createContext<DropdownContextType | null>(null);

function useDropdown() {
  const context = useContext(DropdownContext);

  if (!context) {
    throw new Error(
      "Dropdown components must be inside <DropdownMenu>"
    );
  }

  return context;
}

export function DropdownMenu({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        ref.current &&
        !ref.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  // Close on Escape
  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("keydown", handleEscape);

    return () =>
      document.removeEventListener(
        "keydown",
        handleEscape
      );
  }, []);

  return (
    <DropdownContext.Provider
      value={{ open, setOpen }}
    >
      <div className="relative" ref={ref}>
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

export function DropdownMenuTrigger({
  children,
}: {
  children: React.ReactNode;
}) {
  const { open, setOpen } = useDropdown();

  return (
    <div
      onClick={() => setOpen(!open)}
      className="cursor-pointer"
    >
      {children}
    </div>
  );
}

export function DropdownMenuContent({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { open } = useDropdown();

  if (!open) return null;

  return (
    <div
      className={`absolute right-0 mt-2 w-56 rounded-xl border border-gray-200 bg-white shadow-xl z-50 ${className}`}
    >
      {children}
    </div>
  );
}

export function DropdownMenuItem({
  children,
  onClick,
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  const { setOpen } = useDropdown();

  return (
    <button
      onClick={() => {
        onClick?.();
        setOpen(false);
      }}
      className={`flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${className}`}
    >
      {children}
    </button>
  );
}