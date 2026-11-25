import { Topbar } from "@/components/layout/Topbar";
import { Hero } from "@/features/landing/Hero";
import { FeatureGrid } from "@/features/landing/FeatureGrid";
import { ArrowUpRight, Brain, Shield, Server, Github } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="landing-page min-h-screen">
      <Topbar />
      <Hero />
      <FeatureGrid />
      
      <section className="landing-trust px-6 py-20">
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
          {[{ icon: Shield, title: "Private by design", text: "A considered home for the work that matters to you." }, { icon: Server, title: "Built around your tools", text: "Bring your sources and explore them in one place." }, { icon: Github, title: "Open to curiosity", text: "Made for researchers who like to look closer." }].map((item) => (
            <div key={item.title} className="flex gap-4"><item.icon className="mt-1 shrink-0 text-[#8c735d]" size={22} strokeWidth={1.5} /><div><h3 className="font-serif text-xl">{item.title}</h3><p className="mt-2 text-sm leading-6 text-[#786d60]">{item.text}</p></div></div>
          ))}
        </div>
      </section>
      <footer className="landing-footer relative overflow-hidden">
        <div className="landing-wave landing-wave-back" aria-hidden="true" />
        <div className="landing-wave landing-wave-front" aria-hidden="true" />
        <div className="relative mx-auto max-w-6xl px-6 pb-10 pt-32 md:pt-40">
          <div className="grid gap-12 border-b border-white/20 pb-16 md:grid-cols-[2fr_1fr_1fr]">
            <div>
              <Link href="/" className="inline-flex items-center gap-3 font-serif text-3xl text-[#fff9ef]"><Brain size={29} strokeWidth={1.5} /> Mnemo</Link>
              <p className="mt-5 max-w-sm text-sm leading-7 text-[#eadfd1]">A home for curious minds. Keep what you discover, connect what you know, and find where your next question leads.</p>
            </div>
            <div><h3 className="mb-5 text-xs font-semibold uppercase tracking-[.2em] text-[#d7c1aa]">Explore</h3><div className="flex flex-col gap-3"><Link href="/#features">The workspace</Link><Link href="/signup">Get started</Link><Link href="/login">Sign in</Link></div></div>
            <div><h3 className="mb-5 text-xs font-semibold uppercase tracking-[.2em] text-[#d7c1aa]">Begin here</h3><p className="mb-5 text-sm leading-6 text-[#eadfd1]">The next discovery starts with a question.</p><Link href="/signup" className="landing-footer-cta">Create your space <ArrowUpRight size={17} /></Link></div>
          </div>
          <div className="flex flex-wrap justify-between gap-3 pt-7 text-xs text-[#d7c1aa]"><span>© {new Date().getFullYear()} Mnemo. Made for the curious.</span><span>Research, with room to think.</span></div>
        </div>
      </footer>
    </div>
  );
}
