"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export function Hero() {
  return (
    <section className="landing-hero relative isolate overflow-hidden">
      <div className="landing-hero-image" aria-hidden="true" />
      <div className="landing-hero-wash" aria-hidden="true" />
      <div className="relative mx-auto flex min-h-[690px] max-w-7xl items-center px-6 py-24 md:min-h-[760px] lg:px-10">
        <motion.div
          className="max-w-[650px]"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="landing-eyebrow"><Sparkles size={14} /> A calmer way to discover</span>
          <h1 className="mt-7 font-serif text-[clamp(3.4rem,6vw,6.5rem)] leading-[.99] tracking-[-.055em] text-[#352a22]">
            Give your curiosity <em className="font-normal text-[#76543e]">room to grow.</em>
          </h1>
          <p className="mt-8 max-w-[540px] text-lg leading-relaxed text-[#625649] md:text-xl">
            Gather papers, follow ideas, and ask better questions. Mnemo keeps your research connected, from the first spark to the insight that stays.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link href="/signup" className="landing-button landing-button-primary">Start exploring <ArrowRight size={18} /></Link>
            <Link href="/login" className="landing-button landing-button-secondary">Sign in</Link>
          </div>
          <div className="mt-14 flex items-center gap-3 text-sm text-[#756856]"><span className="h-px w-10 bg-[#a89074]" /> Your thinking, beautifully organized</div>
        </motion.div>
      </div>
      <div className="landing-hero-bottom" aria-hidden="true" />
    </section>
  );
}
