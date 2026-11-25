"use client";

import {
  Brain,
  FileText,
  MessageSquare,
  FolderKanban,
  History,
  Search,
} from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Brain,
    title: "A memory for every idea",
    description:
      "AI that remembers your research context across sessions and documents",
  },
  {
    icon: FileText,
    title: "Papers, made approachable",
    description:
      "Read, annotate, and navigate research papers with AI-powered insights",
  },
  {
    icon: MessageSquare,
    title: "Ask with context",
    description:
      "Ask questions about your documents and get answers with source citations",
  },
  {
    icon: FolderKanban,
    title: "Space to go deeper",
    description:
      "Organize research by topic with dedicated spaces for each project",
  },
  {
    icon: History,
    title: "Pick up your thread",
    description:
      "Pick up where you left off—every conversation is saved and searchable",
  },
  {
    icon: Search,
    title: "Discover what matters",
    description:
      "Semantic search across all your documents with AI-synthesized answers",
  },
];

export function FeatureGrid() {
  return (
    <section id="features" className="landing-features relative overflow-hidden px-6 py-24 md:py-32">
      <div className="landing-feature-arc landing-feature-arc-one" aria-hidden="true" />
      <div className="landing-feature-arc landing-feature-arc-two" aria-hidden="true" />
      <div className="relative max-w-6xl mx-auto">
        <div className="mb-14 max-w-2xl">
          <span className="landing-section-label">THE WORKSPACE</span>
          <h2 className="mt-5 font-serif text-4xl leading-tight tracking-tight text-[#352a22] md:text-6xl">Follow the thought.<br /><em className="text-[#8a6c51]">Find the meaning.</em></h2>
          <p className="mt-5 text-lg leading-relaxed text-[#706252]">Everything you need to make sense of what you find, gathered in one considered place.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="landing-feature-card"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, delay: index * 0.07 }}
            >
              <div className="landing-feature-icon"><feature.icon size={22} strokeWidth={1.7} /></div>
              <span className="landing-feature-number">0{index + 1}</span>
              <h3 className="mt-12 font-serif text-2xl text-[#352a22]">{feature.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#776a5a]">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
