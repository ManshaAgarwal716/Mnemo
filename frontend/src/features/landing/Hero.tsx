"use client";

import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export function Hero() {
  return (
    <section className="pt-32 pb-24 px-6 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Badge variant="primary" size="md" className="mb-8 shadow-sm">
            <Sparkles className="w-3 h-3 mr-1.5" />
            AI-native research workspace
          </Badge>

          <h1 className="text-6xl font-semibold text-gray-900 mb-6 leading-tight tracking-tight">
            Your research, amplified
            <br />
            <span className="text-primary">by semantic AI</span>
          </h1>

          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Mnemo combines browser-like navigation, PDF analysis, and contextual
            AI chat into one intelligent workspace. No more context switching—just
            seamless research with persistent memory.
          </p>

          <div className="flex items-center justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all">
                Get started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="secondary" size="lg" className="shadow-sm hover:shadow-md transition-all">
                Sign in
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
