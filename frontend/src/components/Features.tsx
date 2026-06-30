import {
  Database,
  FileText,
  Sparkles,
  Folder,
  MessageSquare,
  Search,
} from "lucide-react";

const features = [
  {
    icon: Database,
    title: "Semantic memory",
    desc: "Search by meaning. Find 'that scaling laws paper' without remembering the title.",
  },
  {
    icon: FileText,
    title: "PDF workspace",
    desc: "Upload papers, highlight passages, and chat with documents.",
  },
  {
    icon: Sparkles,
    title: "Contextual AI",
    desc: "AI that understands your projects and research history.",
  },
  {
    icon: Folder,
    title: "Project workspaces",
    desc: "Organise notes, papers, and conversations.",
  },
  {
    icon: MessageSquare,
    title: "Conversation memory",
    desc: "Every AI interaction becomes searchable.",
  },
  {
    icon: Search,
    title: "RAG retrieval",
    desc: "Responses grounded in your actual documents.",
  },
];

export default function Features() {
  return (
    <section className="grid md:grid-cols-3 gap-6 pb-32">
      {features.map((feature) => {
        const Icon = feature.icon;

        return (
          <div
            key={feature.title}
            className="bg-white border border-neutral-200 rounded-3xl p-8"
          >
            <div className="w-14 h-14 rounded-2xl bg-violet-100 flex items-center justify-center">
              <Icon
                size={26}
                className="text-violet-500"
              />
            </div>

            <h3 className="mt-6 text-2xl font-semibold">
              {feature.title}
            </h3>

            <p className="mt-4 text-neutral-600 text-lg leading-relaxed">
              {feature.desc}
            </p>
          </div>
        );
      })}
    </section>
  );
}