"use client";
import { motion } from "framer-motion";
import { type Category } from "@/lib/thumbnailService";

const FILTERS: { id: Category | "all"; label: string; emoji: string }[] = [
  { id: "all", label: "All", emoji: "🌐" },
  { id: "gaming", label: "Gaming", emoji: "🎮" },
  { id: "educational", label: "Educational", emoji: "📚" },
  { id: "etc", label: "Etc", emoji: "✨" },
];

interface Props {
  active: Category | "all";
  onChange: (cat: Category | "all") => void;
}

export default function CategoryFilter({ active, onChange }: Props) {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {FILTERS.map((f) => {
        const isActive = f.id === active;
        return (
          <motion.button
            key={f.id}
            onClick={() => onChange(f.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            className={`relative px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 border ${
              isActive
                ? "bg-gradient-to-r from-violet-600 to-fuchsia-500 border-transparent text-white shadow-lg shadow-violet-500/30"
                : "bg-white/5 border-white/10 text-white/60 hover:text-white hover:border-white/20 hover:bg-white/10"
            }`}
          >
            {isActive && (
              <motion.span
                layoutId="activeFilter"
                className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 -z-10"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            {f.emoji} {f.label}
          </motion.button>
        );
      })}
    </div>
  );
}
