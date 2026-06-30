import { Topbar } from "@/components/layout/Topbar";
import { Hero } from "@/features/landing/Hero";
import { FeatureGrid } from "@/features/landing/FeatureGrid";
import { Shield, Server, Github } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Topbar />
      <Hero />
      <FeatureGrid />
      
      {/* Footer trust strip */}
      <footer className="border-t border-gray-100 bg-gray-50 py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h4 className="text-base font-semibold text-gray-900">Privacy first</h4>
              <p className="text-sm text-gray-600 max-w-xs">
                Your research stays yours. All data encrypted and secure.
              </p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center">
                <Server className="w-6 h-6 text-primary" />
              </div>
              <h4 className="text-base font-semibold text-gray-900">Bring your AI</h4>
              <p className="text-sm text-gray-600 max-w-xs">
                Works with OpenAI, Anthropic, or your own models.
              </p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center">
                <Github className="w-6 h-6 text-primary" />
              </div>
              <h4 className="text-base font-semibold text-gray-900">Open source</h4>
              <p className="text-sm text-gray-600 max-w-xs">
                Built in public. Inspect the code and contribute.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
