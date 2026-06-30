"use client";

const concepts = [
  "Self-attention",
  "Query-Key-Value",
  "Multi-head attention",
  "Positional encoding",
];

export function ConceptChips() {
  return (
    <div className="flex flex-wrap gap-2 px-4 py-2 border-t border-gray-200">
      {concepts.map((concept) => (
        <button
          key={concept}
          className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-xs text-gray-700 transition-colors"
        >
          {concept}
        </button>
      ))}
    </div>
  );
}
