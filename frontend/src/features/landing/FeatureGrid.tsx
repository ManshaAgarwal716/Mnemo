"use client";

import { Card } from "@/components/ui/Card";
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
    title: "Semantic memory",
    description:
      "AI that remembers your research context across sessions and documents",
  },
  {
    icon: FileText,
    title: "PDF workspace",
    description:
      "Read, annotate, and navigate research papers with AI-powered insights",
  },
  {
    icon: MessageSquare,
    title: "Contextual AI chat",
    description:
      "Ask questions about your documents and get answers with source citations",
  },
  {
    icon: FolderKanban,
    title: "Project workspaces",
    description:
      "Organize research by topic with dedicated spaces for each project",
  },
  {
    icon: History,
    title: "Conversation memory",
    description:
      "Pick up where you left off—every conversation is saved and searchable",
  },
  {
    icon: Search,
    title: "RAG retrieval",
    description:
      "Semantic search across all your documents with AI-synthesized answers",
  },
];

export function FeatureGrid() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold text-gray-900 mb-3">
            Everything you need for intelligent research
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Powerful features designed to streamline your research workflow
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="p-6 h-full hover:shadow-lg transition-shadow duration-300">
                <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
