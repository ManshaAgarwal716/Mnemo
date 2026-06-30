import {
  Home,
  LayoutDashboard,
  FolderKanban,
  Sparkles,
  Search,
} from "lucide-react";

export default function BottomNav() {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white border rounded-3xl p-2 flex gap-2 shadow-lg">
      <button className="px-5 py-3 rounded-2xl bg-violet-100 flex items-center gap-2">
        <Home size={18} />
        Landing
      </button>

      <button className="px-5 py-3 rounded-2xl flex items-center gap-2">
        <LayoutDashboard size={18} />
        Dashboard
      </button>

      <button className="px-5 py-3 rounded-2xl flex items-center gap-2">
        <FolderKanban size={18} />
        Workspace
      </button>

      <button className="px-5 py-3 rounded-2xl flex items-center gap-2">
        <Sparkles size={18} />
        AI Assistant
      </button>

      <button className="px-5 py-3 rounded-2xl flex items-center gap-2">
        <Search size={18} />
        Search
      </button>
    </div>
  );
}