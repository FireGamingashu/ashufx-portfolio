"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import styles from "./Showcase.module.css";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Thumbnail {
  id: string;
  url: string;
  title: string;
  tag: string;
  price: number;
  category: string;
  createdAt: number;
  docId: string;
}

type DB = { gaming: Thumbnail[]; educational: Thumbnail[]; etc: Thumbnail[] };

// ─── Category meta (static display info only) ─────────────────────────────────

const CATEGORIES = [
  {
    id: "gaming",
    label: "GAMING",
    color: "#A855F7",
    darkColor: "#7C3AED",
    icon: "🎮",
    desc: "High-energy, neon-charged gaming thumbnails built to dominate YouTube search and maximize click-through rates.",
  },
  {
    id: "etc",
    label: "ETC",
    color: "#F59E0B",
    darkColor: "#D97706",
    icon: "✨",
    desc: "Versatile thumbnails for reaction videos, lifestyle content, challenges, and everything in between — bold layouts built for clicks.",
  },
  {
    id: "educational",
    label: "EDU",
    color: "#06B6D4",
    darkColor: "#0891B2",
    icon: "📚",
    desc: "Clean, professional educational thumbnails that communicate authority and curiosity — designed to boost watch time on tutorial and explainer content.",
  },
];

// ─── Color helpers ────────────────────────────────────────────────────────────

const darkenColor = (hex: string, percent: number): string => {
  let color = hex.startsWith("#") ? hex.slice(1) : hex;
  if (color.length === 3) color = color.split("").map((c) => c + c).join("");
  const num = parseInt(color, 16);
  let r = (num >> 16) & 0xff;
  let g = (num >> 8) & 0xff;
  let b = num & 0xff;
  r = Math.max(0, Math.min(255, Math.floor(r * (1 - percent))));
  g = Math.max(0, Math.min(255, Math.floor(g * (1 - percent))));
  b = Math.max(0, Math.min(255, Math.floor(b * (1 - percent))));
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
};

// ─── InteractiveFolder ───────────────────────────────────────────────────────

interface FolderProps {
  openIndex: number | null;
  onSelect: (index: number) => void;
}

function InteractiveFolder({ openIndex, onSelect }: FolderProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const isOpen = openIndex !== null;
  const folderBackColor = "#1a0a3e";
  const folderFrontColor = "#2d1060";

  const paperBaseTransforms = [
    { x: "-135%", y: "-90%", rotate: -18 },
    { x: "35%",  y: "-90%", rotate:  18 },
    { x: "-50%", y: "-120%", rotate:  4 },
  ];

  const getPaperStyle = (i: number) => {
    if (!isOpen) return { x: "-50%", y: "8%", rotate: 0, scale: 1 };
    const base = paperBaseTransforms[i];
    if (hovered === i) {
      return {
        x: `calc(${base.x} + ${mousePos.x}px)`,
        y: `calc(${base.y} + ${mousePos.y}px)`,
        rotate: base.rotate,
        scale: 1.12,
      };
    }
    return { x: base.x, y: base.y, rotate: base.rotate, scale: openIndex === i ? 1.06 : 1 };
  };

  const handlePaperMouseMove = (e: React.MouseEvent, i: number) => {
    if (!isOpen) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - (rect.left + rect.width / 2)) * 0.25;
    const y = (e.clientY - (rect.top + rect.height / 2)) * 0.25;
    setMousePos({ x, y });
    setHovered(i);
  };

  return (
    <div className={styles.folderScene}>
      <div
        className={styles.folderGlow}
        style={{ background: isOpen && openIndex !== null ? `radial-gradient(circle, ${CATEGORIES[openIndex].color}40 0%, transparent 70%)` : "radial-gradient(circle, #7C3AED30 0%, transparent 70%)" }}
      />

      <div className={styles.folderRoot} style={{ transform: "scale(2.2)" }}>
        <div
          className={styles.folderBody}
          style={{
            backgroundColor: folderBackColor,
            boxShadow: isOpen ? "0 20px 60px -10px rgba(0,0,0,0.5)" : "0 8px 24px -4px rgba(0,0,0,0.3)",
          }}
        >
          <div className={styles.folderTab} style={{ backgroundColor: folderBackColor }} />

          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.id}
              animate={getPaperStyle(i)}
              transition={{ type: "spring", stiffness: 280, damping: 22, mass: 0.9 }}
              className={styles.paper}
              style={{
                backgroundColor: openIndex === i ? cat.color : darkenColor(cat.color, 0.3),
                width: i === 0 ? 70 : i === 1 ? 80 : 90,
                height: i === 0 ? 58 : i === 1 ? 64 : 72,
                zIndex: 20 + i,
                border: openIndex === i ? `2px solid ${cat.color}` : "1px solid rgba(255,255,255,0.08)",
                boxShadow: openIndex === i ? `0 0 18px ${cat.color}80` : "0 2px 8px rgba(0,0,0,0.25)",
                cursor: isOpen ? "pointer" : "default",
              }}
              onMouseMove={(e) => handlePaperMouseMove(e, i)}
              onMouseLeave={() => { setMousePos({ x: 0, y: 0 }); setHovered(null); }}
              onClick={(e) => { e.stopPropagation(); if (isOpen) onSelect(i); }}
            >
              <div className={styles.paperContent}>
                <span className={styles.paperIcon}>{cat.icon}</span>
                {isOpen && (
                  <span className={styles.paperLabel}>{cat.label}</span>
                )}
              </div>
            </motion.div>
          ))}

          <motion.div
            animate={{ skewX: isOpen ? 14 : 0, scaleY: isOpen ? 0.55 : 1, translateY: isOpen ? 5 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            className={styles.flapHalf}
            style={{
              backgroundColor: folderFrontColor,
              clipPath: "polygon(0 0, 50% 0, 50% 100%, 0 100%)",
              transformOrigin: "bottom",
              zIndex: 30,
            }}
          />
          <motion.div
            animate={{ skewX: isOpen ? -14 : 0, scaleY: isOpen ? 0.55 : 1, translateY: isOpen ? 5 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            className={styles.flapHalf}
            style={{
              backgroundColor: folderFrontColor,
              clipPath: "polygon(50% 0, 100% 0, 100% 100%, 50% 100%)",
              transformOrigin: "bottom",
              zIndex: 30,
            }}
          >
            {!isOpen && (
              <div className={styles.flapLabel}>Click to Explore</div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Showcase ────────────────────────────────────────────────────────────

export default function Showcase() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [db, setDb] = useState<DB>({ gaming: [], educational: [], etc: [] });
  const [loading, setLoading] = useState(true);
  const thumbsRef = useRef<HTMLDivElement>(null);

  // Fetch all thumbnails from API on mount
  useEffect(() => {
    fetch("/api/thumbnails")
      .then((r) => r.json())
      .then((data: DB) => { setDb(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleFolderClick = () => {
    if (openIndex === null) {
      setOpenIndex(0);
      setTimeout(() => thumbsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 350);
    } else {
      setOpenIndex(null);
    }
  };

  const handleCategorySelect = (i: number) => {
    setOpenIndex(i);
    setTimeout(() => thumbsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 200);
  };

  const activeCategory = openIndex !== null ? CATEGORIES[openIndex] : null;
  const activeThumbs: Thumbnail[] = activeCategory
    ? (db[activeCategory.id as keyof DB] ?? [])
    : [];

  return (
    <section id="showcase" className={`section-padding ${styles.showcase}`}>
      <div className={styles.bgGlowTop} />

      <div className="container">
        {/* Header */}
        <div className={styles.showcaseHeader}>
          <div className="section-tag">✦ Portfolio</div>
          <h2 className={styles.sectionTitle}>
            Thumbnail <span className="gradient-text">Showcase</span>
          </h2>
          <p className={styles.sectionSub}>
            Click the folder to explore — pick a category and see real work that converts viewers into clicks.
          </p>
        </div>

        {/* Folder + category pills */}
        <div className={styles.folderArea}>
          <div
            className={styles.folderClickTarget}
            onClick={handleFolderClick}
            id="showcase-folder"
          >
            <InteractiveFolder
              openIndex={openIndex}
              onSelect={handleCategorySelect}
            />
          </div>

          <AnimatePresence>
            {openIndex !== null && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.4, delay: 0.15 }}
                className={styles.categoryTabs}
              >
                {CATEGORIES.map((cat, i) => (
                  <button
                    key={cat.id}
                    id={`tab-${cat.id}`}
                    className={`${styles.catTab} ${openIndex === i ? styles.catTabActive : ""}`}
                    style={openIndex === i ? { background: cat.color, borderColor: cat.color, color: "#fff", boxShadow: `0 0 20px ${cat.color}60` } : {}}
                    onClick={() => handleCategorySelect(i)}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Thumbnail Grid */}
        <div ref={thumbsRef}>
          <AnimatePresence mode="wait">
            {activeCategory && (
              <motion.div
                key={activeCategory.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className={styles.categorySection}
              >
                {/* Category info bar */}
                <div className={styles.catInfoBar}>
                  <div className={styles.catAccent} style={{ background: activeCategory.color }} />
                  <div>
                    <h3 className={styles.catTitle} style={{ color: activeCategory.color }}>
                      {activeCategory.icon}{" "}
                      {activeCategory.label === "EDU"
                        ? "Educational"
                        : activeCategory.label === "ETC"
                        ? "ETC (More Styles)"
                        : activeCategory.label.charAt(0) + activeCategory.label.slice(1).toLowerCase()}
                    </h3>
                    <p className={styles.catDesc}>{activeCategory.desc}</p>
                  </div>
                </div>

                {/* Loading state */}
                {loading && (
                  <p style={{ color: "#64748b", textAlign: "center", padding: "40px" }}>Loading thumbnails…</p>
                )}

                {/* Empty state */}
                {!loading && activeThumbs.length === 0 && (
                  <p style={{ color: "#64748b", textAlign: "center", padding: "40px" }}>
                    No thumbnails yet in this category.
                  </p>
                )}

                {/* Thumbnail cards */}
                {!loading && activeThumbs.length > 0 && (
                  <div className={styles.thumbGrid}>
                    {activeThumbs.map((thumb, ti) => (
                      <motion.div
                        key={thumb.docId}
                        initial={{ opacity: 0, scale: 0.92, y: 24 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.45, delay: ti * 0.12, ease: [0.16, 1, 0.3, 1] }}
                        className={styles.thumbCard}
                        style={{ borderColor: `${activeCategory.color}40` }}
                      >
                        <div className={styles.thumbImgWrap}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={thumb.url}
                            alt={thumb.title}
                            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                          />
                          <div className={styles.thumbOverlay} />
                          <div
                            className={styles.thumbBadge}
                            style={{ background: activeCategory.color }}
                          >
                            {thumb.tag}
                          </div>
                          <div
                            className={styles.thumbPrice}
                            style={{ color: activeCategory.color }}
                          >
                            ${thumb.price}
                          </div>
                        </div>
                        <div className={styles.thumbInfo}>
                          <h4 className={styles.thumbTitle}>{thumb.title}</h4>
                          <a
                            href="#contact"
                            className="btn-primary"
                            style={{ fontSize: "0.82rem", padding: "10px 20px" }}
                            onClick={(e) => {
                              e.preventDefault();
                              document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
                            }}
                          >
                            Order This Style →
                          </a>
                        </div>
                        <div
                          className={styles.thumbGlow}
                          style={{ background: `radial-gradient(circle, ${activeCategory.color}25, transparent 70%)` }}
                        />
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Close hint */}
        {openIndex !== null && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={styles.closeHint}
            onClick={handleFolderClick}
          >
            ✕ Click the folder to close
          </motion.p>
        )}
      </div>
    </section>
  );
}
