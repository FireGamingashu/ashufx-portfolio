"use client";
import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, CheckCircle, Loader2 } from "lucide-react";
import { type Category, uploadThumbnail, replaceThumbnail } from "@/lib/thumbnailService";

interface Props {
  category: Category;
  /** If provided, we're in replace mode for this thumb */
  replaceId?: string;
  replaceDocId?: string;
  onSuccess: (url: string) => void;
  onClose: () => void;
}

export default function UploadModal({
  category,
  replaceId,
  replaceDocId,
  onSuccess,
  onClose,
}: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusLabel, setStatusLabel] = useState("");
  const [status, setStatus] = useState<"idle" | "uploading" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const pickFile = (f: File) => {
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setStatus("idle");
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f && f.type.startsWith("image/")) pickFile(f);
  }, []);

  const handleUpload = async () => {
    if (!file) return;
    setStatus("uploading");
    setProgress(0);
    setStatusLabel("Uploading image to Cloudinary…");
    try {
      const onProg = (pct: number) => {
        setProgress(pct);
        if (pct >= 90) setStatusLabel("Saving to database…");
        else setStatusLabel("Uploading image to Cloudinary…");
      };
      if (replaceId && replaceDocId) {
        const url = await replaceThumbnail(
          category,
          replaceId,
          replaceDocId,
          file,
          6,
          onProg
        );
        onSuccess(url);
      } else {
        const thumb = await uploadThumbnail(category, file, 6, onProg);
        onSuccess(thumb.url);
      }
      setStatus("done");
      setStatusLabel("");
      setTimeout(onClose, 1200);
    } catch (e: unknown) {
      setStatus("error");
      setStatusLabel("");
      setErrorMsg(e instanceof Error ? e.message : "Upload failed — check Firestore rules & Cloudinary preset");
    }
  };

  const isReplace = !!replaceId;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          className="w-full max-w-md bg-[#0f0f1a] border border-white/10 rounded-3xl p-6 shadow-2xl"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-white font-bold text-lg">
              {isReplace ? `Replace ${replaceId}` : "Upload Thumbnail"}
            </h2>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition"
            >
              <X size={18} />
            </button>
          </div>

          {/* Drop zone */}
          <div
            onDrop={onDrop}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onClick={() => document.getElementById("fileInput")?.click()}
            className={`relative cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300 overflow-hidden ${
              dragging
                ? "border-violet-400 bg-violet-500/10"
                : "border-white/15 hover:border-violet-400/50 hover:bg-white/5"
            }`}
            style={{ minHeight: 180 }}
          >
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) pickFile(f); }}
            />
            {preview ? (
              <img src={preview} alt="preview" className="w-full h-48 object-cover" />
            ) : (
              <div className="flex flex-col items-center justify-center h-44 gap-3 text-white/40">
                <Upload size={36} strokeWidth={1.5} />
                <span className="text-sm">Drag & drop or click to browse</span>
                <span className="text-xs">PNG, JPG, WEBP</span>
              </div>
            )}
          </div>

          {/* Category info */}
          <p className="mt-3 text-sm text-white/40">
            Category: <span className="text-violet-400 font-semibold capitalize">{category}</span>
            {isReplace
              ? <span className="ml-2 text-amber-400">• Replacing {replaceId}</span>
              : <span className="ml-2 text-green-400">• Auto-named next thumb</span>}
          </p>

          {/* Progress bar */}
          {status === "uploading" && (
            <div className="mt-4">
              <div className="flex justify-between items-center mb-1">
                <p className="text-xs text-violet-400">{statusLabel}</p>
                <p className="text-xs text-white/40">{progress}%</p>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          )}

          {/* Error */}
          {status === "error" && (
            <p className="mt-3 text-sm text-red-400 bg-red-500/10 rounded-xl p-2">{errorMsg}</p>
          )}

          {/* Button */}
          <button
            onClick={handleUpload}
            disabled={!file || status === "uploading" || status === "done"}
            className="mt-5 w-full py-3 rounded-2xl font-semibold text-white transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: "linear-gradient(135deg, #7c3aed, #c026d3)",
              boxShadow: file && status === "idle" ? "0 0 24px rgba(124,58,237,0.4)" : undefined,
            }}
          >
            {status === "uploading" ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 size={16} className="animate-spin" /> Uploading…
              </span>
            ) : status === "done" ? (
              <span className="flex items-center justify-center gap-2">
                <CheckCircle size={16} className="text-green-400" /> Done!
              </span>
            ) : isReplace ? (
              "Replace Thumbnail"
            ) : (
              "Upload Thumbnail"
            )}
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
