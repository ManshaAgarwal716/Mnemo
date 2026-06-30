export default function Navbar() {
  return (
    <header className="h-20 border-b border-neutral-200 bg-white">
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-500" />

          <span className="text-3xl font-semibold">
            mnemo
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button className="px-6 py-3 border rounded-2xl font-medium">
            Sign in
          </button>

          <button className="px-6 py-3 rounded-2xl bg-violet-500 text-white font-medium">
            Get Started
          </button>
        </div>
      </div>
    </header>
  );
}