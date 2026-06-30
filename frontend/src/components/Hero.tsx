import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="py-28 flex flex-col items-center text-center">
      <div className="px-5 py-2 rounded-full border border-violet-300 text-violet-600 font-medium">
        AI-native research workspace
      </div>

      <h1 className="mt-8 text-7xl font-bold max-w-5xl leading-tight">
        Research that{" "}
        <span className="text-violet-500">
          remembers
        </span>
        <br />
        what matters to you
      </h1>

      <p className="mt-8 text-2xl text-neutral-600 max-w-3xl">
        Mnemo gives your research a persistent semantic
        memory — so ideas, papers, and insights compound
        over time instead of disappearing.
      </p>

      <div className="flex gap-5 mt-12">
        <button className="px-8 py-4 border rounded-2xl text-xl font-medium flex items-center gap-2">
          Open workspace
          <ArrowRight size={20} />
        </button>

        <button className="px-8 py-4 border rounded-2xl text-xl font-medium">
          See a demo
        </button>
      </div>
    </section>
  );
}