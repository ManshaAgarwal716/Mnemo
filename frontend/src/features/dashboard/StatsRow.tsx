"use client";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { FileText, MessageSquare, Database } from "lucide-react";

const stats = [
  {
    label: "Documents indexed",
    value: "127",
    icon: FileText,
  },
  {
    label: "AI conversations",
    value: "43",
    icon: MessageSquare,
    delta: "+8 this week",
  },
  {
    label: "Embeddings stored",
    value: "12.4K",
    icon: Database,
  },
];

export function StatsRow() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {stats.map((stat) => (
        <Card key={stat.label} className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
              <p className="text-2xl font-medium text-gray-900">{stat.value}</p>
              {stat.delta && (
                <Badge variant="teal" className="mt-2">
                  {stat.delta}
                </Badge>
              )}
            </div>
            <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center">
              <stat.icon className="w-5 h-5 text-gray-600" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
