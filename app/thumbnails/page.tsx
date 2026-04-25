"use client";
import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, RefreshCw } from "lucide-react";
import CategoryFilter from "@/app/components/CategoryFilter";
import ThumbnailCard from "@/app/components/ThumbnailCard";
import { fetchThumbnailsByCategory, type Category, type Thumbnail } from "@/lib/thumbnailService";

const ALL_CATEGORIES: Category[] = ["gaming", "educational", "etc"];

export default function ThumbnailsPage() {
  const [active, setActive] = useState<Category | "all">("all");
  const [thumbnails, setThumbnails] = useState<Thumbnail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const results = await Promise.all(
        ALL_CATEGORIES.map((cat) => fetchThumbnailsByCategory(cat))
      );
      setThumbnails(results.flat());
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load thumbnails.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const filtered =
    active === "all"
      ? thumbnails
      : thumbnails.filter((t) => t.category === active);

  return (
    <main
      className="min-h-screen text-white"
      style={{
        background:
          "radial-gradient(ellipse at 20% 0%, #1a0533 0%, #0a0a0f 60%, #0d0d1a 100%)",
      }}
    >
      {/* ── Hero Header ── */}
      <section className="pt-20 pb-12 px-4 text-center relative overflow-hidden">
        {/* Background glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 40% at 50% 0%, rgba(124,58,237,0.18) 0%, transparent 70%)",
          }}
        />
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 text-violet-400 text-sm font-semibold tracking-widest uppercase mb-3">
            <Sparkles size={14} /> Ashu FX Thumbnails
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-4">
            Premium{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #a855f7, #ec4899)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Thumbnails
            </span>
          </h1>
          <p className="text-white/50 max-w-md mx-auto text-sm">
            High-quality designs for gaming, education, and creative content — each $6.
          </p>
        </motion.div>

        {/* Filter */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <CategoryFilter active={active} onChange={setActive} />
        </motion.div>
      </section>

      {/* ── Grid ── */}
      <section className="max-w-6xl mx-auto px-4 pb-24">
        {/* Stats bar */}
        <div className="flex items-center justify-between mb-6 text-white/40 text-sm">
          <span>
            {loading ? "Loading…" : `${filtered.length} thumbnail${filtered.length !== 1 ? "s" : ""}`}
          </span>
          <button
            onClick={loadAll}
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* Error state */}
        {error && (
          <div className="text-center py-16 text-red-400">
            <p>{error}</p>
            <button
              onClick={loadAll}
              className="mt-4 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl text-sm hover:bg-red-500/20 transition"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl bg-white/5 border border-white/5 overflow-hidden animate-pulse"
              >
                <div className="aspect-video bg-white/5" />
                <div className="p-3 flex justify-between">
                  <div className="h-6 w-20 bg-white/10 rounded-full" />
                  <div className="h-6 w-8 bg-white/10 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Thumbnails */}
        {!loading && !error && (
          <AnimatePresence mode="wait">
            {filtered.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-24 text-white/30"
              >
                <p className="text-5xl mb-4">🖼️</p>
                <p className="text-lg font-semibold">No thumbnails yet</p>
                <p className="text-sm mt-1">Upload some from the admin panel.</p>
              </motion.div>
            ) : (
              <motion.div
                key={active}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
              >
                {filtered.map((thumb, i) => (
                  <ThumbnailCard key={`${thumb.category}-${thumb.id}`} thumbnail={thumb} index={i} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </section>
    </main>
  );
}
