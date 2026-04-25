"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { type Thumbnail } from "@/lib/thumbnailService";

interface Props {
  thumbnail: Thumbnail;
  index: number;
}

const CATEGORY_COLORS: Record<string, string> = {
  gaming: "from-purple-500 to-pink-500",
  educational: "from-cyan-500 to-blue-500",
  etc: "from-amber-500 to-orange-500",
};

const CATEGORY_LABELS: Record<string, string> = {
  gaming: "🎮 Gaming",
  educational: "📚 Educational",
  etc: "✨ Etc",
};

export default function ThumbnailCard({ thumbnail, index }: Props) {
  const gradClass = CATEGORY_COLORS[thumbnail.category] ?? "from-gray-500 to-gray-700";
  const label = CATEGORY_LABELS[thumbnail.category] ?? thumbnail.category;

  return (
    <motion.div
      initial={{ opacity: 0, y: 32, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.07, ease: "easeOut" }}
      whileHover={{ y: -6, scale: 1.02 }}
      className="group relative rounded-2xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm cursor-pointer"
      style={{ boxShadow: "0 0 24px rgba(0,0,0,0.5)" }}
    >
      {/* Image */}
      <div className="relative aspect-video overflow-hidden bg-black/30">
        <Image
          src={thumbnail.url}
          alt={`${thumbnail.category} - ${thumbnail.id}`}
          fill
          loading="lazy"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Shimmer overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Card Footer */}
      <div className="p-3 flex items-center justify-between gap-2">
        {/* Category Badge */}
        <span
          className={`text-xs font-semibold px-2 py-1 rounded-full bg-gradient-to-r ${gradClass} text-white`}
        >
          {label}
        </span>

        {/* Price */}
        <span className="text-base font-bold text-white">
          ${thumbnail.price}
        </span>
      </div>

      {/* ID label */}
      <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white/60 text-xs px-2 py-0.5 rounded-full border border-white/10">
        {thumbnail.id}
      </div>
    </motion.div>
  );
}
