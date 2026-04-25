"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";

type Category = "gaming" | "educational" | "etc";

interface Thumbnail {
  id: string;
  url: string;
  title: string;
  tag: string;
  description: string;
  price: number;
  category: Category;
  createdAt: number;
  docId: string;
}

type DB = Record<Category, Thumbnail[]>;

const CAT_META: Record<Category, { icon: string; color: string; label: string }> = {
  gaming:      { icon: "🎮", color: "#A855F7", label: "Gaming" },
  educational: { icon: "📚", color: "#06B6D4", label: "Educational" },
  etc:         { icon: "✨", color: "#F59E0B", label: "ETC" },
};

// ── Your Cloudinary cloud name (from your existing URLs) ──────────────────────
const CLOUDINARY_CLOUD = "da77xtn23";
// ⚠️ You MUST create an unsigned upload preset named "ashufx_unsigned"
// Go to: cloudinary.com → Settings → Upload → Upload Presets → Add Unsigned Preset
// Name it exactly: ashufx_unsigned
const CLOUDINARY_PRESET = "ashufx_unsigned";

export default function AdminPage() {
  const router = useRouter();
  const [db, setDb]             = useState<DB>({ gaming: [], educational: [], etc: [] });
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState<Category | "all">("all");
  const [search, setSearch]     = useState("");
  const [editItem, setEditItem] = useState<Thumbnail | null>(null);

  // Form state
  const [inTitle,    setInTitle]    = useState("");
  const [inTag,      setInTag]      = useState("");
  const [inDesc,     setInDesc]     = useState("");
  const [inPrice,    setInPrice]    = useState("6");
  const [inUrl,      setInUrl]      = useState("");
  const [inCat,      setInCat]      = useState<Category>("gaming");
  const [adding,     setAdding]     = useState(false);
  const [saving,     setSaving]     = useState(false);
  const [uploading,  setUploading]  = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const [toasts, setToasts] = useState<{ id: number; msg: string; type: string }[]>([]);

  const toast = useCallback((msg: string, type = "info") => {
    const id = Date.now();
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500);
  }, []);

  // ── Load ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    fetch("/api/thumbnails")
      .then(r => r.json())
      .then((data: DB) => { setDb(data); setLoading(false); })
      .catch(() => { setLoading(false); toast("Could not load thumbnails", "error"); });
  }, [toast]);

  // ── Upload image to Cloudinary ────────────────────────────────────────────
  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show local preview immediately
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);

    setUploading(true);
    toast("Uploading image to Cloudinary…", "info");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_PRESET);
      formData.append("folder", `ashufx/${inCat}`);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`,
        { method: "POST", body: formData }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error?.message || "Upload failed");
      }

      const data = await res.json();
      setInUrl(data.secure_url);
      setPreviewUrl(data.secure_url);
      toast("Image uploaded! ✅", "success");
    } catch (e) {
      toast("Upload failed: " + String(e), "error");
      setPreviewUrl("");
    }
    setUploading(false);
    // reset file input
    if (fileRef.current) fileRef.current.value = "";
  }

  // ── Add ───────────────────────────────────────────────────────────────────
  async function addThumbnail() {
    if (!inTitle) { toast("Enter a title", "error"); return; }
    if (!inUrl)   { toast("Enter or upload an image", "error"); return; }
    try { new URL(inUrl); } catch { toast("Invalid URL", "error"); return; }

    setAdding(true);
    try {
      const res = await fetch("/api/thumbnails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category:    inCat,
          url:         inUrl,
          title:       inTitle,
          tag:         inTag,
          description: inDesc,
          price:       parseFloat(inPrice) || 6,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      const thumb: Thumbnail = await res.json();
      setDb(prev => ({ ...prev, [inCat]: [thumb, ...(prev[inCat] || [])] }));
      setInTitle(""); setInTag(""); setInDesc(""); setInPrice("6"); setInUrl(""); setPreviewUrl("");
      toast("Thumbnail added!", "success");
    } catch (e) { toast("Add failed: " + String(e), "error"); }
    setAdding(false);
  }

  // ── Delete ────────────────────────────────────────────────────────────────
  async function deleteThumbnail(category: Category, docId: string) {
    if (!confirm("Delete this thumbnail from your portfolio?")) return;
    try {
      const res = await fetch(`/api/thumbnails?category=${category}&docId=${encodeURIComponent(docId)}`, { method: "DELETE" });
      if (!res.ok) throw new Error(await res.text());
      setDb(prev => ({ ...prev, [category]: prev[category].filter(t => t.docId !== docId) }));
      toast("Deleted.", "info");
    } catch (e) { toast("Delete failed: " + String(e), "error"); }
  }

  // ── Edit ──────────────────────────────────────────────────────────────────
  async function saveEdit() {
    if (!editItem) return;
    setSaving(true);
    try {
      const res = await fetch("/api/thumbnails", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category:    editItem.category,
          docId:       editItem.docId,
          title:       editItem.title,
          tag:         editItem.tag,
          description: editItem.description,
          price:       editItem.price,
          url:         editItem.url,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      const updated: Thumbnail = await res.json();
      setDb(prev => ({
        ...prev,
        [editItem.category]: prev[editItem.category].map(t => t.docId === updated.docId ? updated : t),
      }));
      setEditItem(null);
      toast("Saved!", "success");
    } catch (e) { toast("Save failed: " + String(e), "error"); }
    setSaving(false);
  }

  // ── Logout ────────────────────────────────────────────────────────────────
  async function logout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  }

  // ── Derived list ──────────────────────────────────────────────────────────
  const cats: Category[] = filter === "all" ? ["gaming", "educational", "etc"] : [filter];
  let list: Thumbnail[] = [];
  cats.forEach(c => { (db[c] || []).forEach(t => list.push({ ...t, category: c })); });
  list.sort((a, b) => b.createdAt - a.createdAt);
  if (search) list = list.filter(t =>
    (t.title || "").toLowerCase().includes(search.toLowerCase()) ||
    (t.tag   || "").toLowerCase().includes(search.toLowerCase())
  );

  const total = Object.values(db).reduce((s, arr) => s + arr.length, 0);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --bg:#0d0f14; --surface:#161b27; --card:#1e2535; --border:#2a3348;
          --accent:#6c63ff; --accent2:#a78bfa; --danger:#ef4444;
          --success:#22c55e; --text:#e2e8f0; --muted:#64748b; --radius:14px;
        }
        body { font-family:'Inter',sans-serif; background:var(--bg); color:var(--text); min-height:100vh; }
        .admin-wrap { max-width:1200px; margin:0 auto; padding:28px 20px; }
        .panel { background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); padding:24px; margin-bottom:24px; }
        .panel-title { font-size:14px; font-weight:600; color:var(--accent2); margin-bottom:18px; }
        .form-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
        @media(max-width:600px) { .form-grid { grid-template-columns:1fr; } }
        label { display:block; font-size:11px; font-weight:500; color:var(--muted); margin-bottom:6px; text-transform:uppercase; letter-spacing:.5px; }
        input,select { width:100%; background:var(--card); border:1px solid var(--border); border-radius:9px; padding:10px 13px; color:var(--text); font-family:inherit; font-size:13px; outline:none; transition:border-color .2s; }
        input:focus,select:focus { border-color:var(--accent); }
        input::placeholder { color:var(--muted); }
        select option { background:var(--card); }
        .btn { display:inline-flex; align-items:center; gap:6px; padding:10px 18px; border-radius:9px; border:none; font-family:inherit; font-size:13px; font-weight:600; cursor:pointer; transition:all .2s; white-space:nowrap; }
        .btn-primary { background:linear-gradient(135deg,#6c63ff,#a78bfa); color:#fff; }
        .btn-primary:hover { transform:translateY(-1px); box-shadow:0 6px 18px rgba(108,99,255,.4); }
        .btn-primary:disabled { opacity:.6; cursor:not-allowed; transform:none; }
        .btn-ghost { background:transparent; border:1px solid var(--border); color:var(--muted); }
        .btn-ghost:hover { border-color:var(--text); color:var(--text); }
        .btn-upload { background:rgba(34,197,94,.12); border:1px solid rgba(34,197,94,.3); color:#86efac; }
        .btn-upload:hover { background:rgba(34,197,94,.25); }
        .btn-upload:disabled { opacity:.6; cursor:not-allowed; }

        /* Upload zone */
        .upload-zone {
          border:2px dashed var(--border); border-radius:12px; padding:20px;
          display:flex; flex-direction:column; align-items:center; gap:10px;
          cursor:pointer; transition:all .2s; background:var(--card);
          text-align:center;
        }
        .upload-zone:hover { border-color:var(--accent); background:rgba(108,99,255,.05); }
        .upload-zone.has-preview { border-style:solid; border-color:var(--accent); padding:10px; }
        .preview-img { width:100%; max-height:140px; object-fit:contain; border-radius:8px; }
        .upload-hint { font-size:12px; color:var(--muted); }
        .upload-icon { font-size:28px; }

        /* URL row */
        .url-row { display:flex; gap:8px; align-items:flex-end; }
        .url-row input { flex:1; }

        /* Row bottom */
        .form-bottom { display:flex; gap:12px; align-items:flex-end; flex-wrap:wrap; margin-top:4px; }
        .form-bottom > div { flex:1; min-width:140px; }

        /* spinner */
        .spin { display:inline-block; width:14px; height:14px; border:2px solid rgba(255,255,255,.3); border-top-color:#fff; border-radius:50%; animation:spin .6s linear infinite; }
        @keyframes spin { to { transform:rotate(360deg); } }

        /* progress bar */
        .uploading-bar { height:3px; background:linear-gradient(90deg,#6c63ff,#a78bfa); border-radius:2px; animation:bar 1.5s ease-in-out infinite; }
        @keyframes bar { 0%{width:0%} 60%{width:80%} 100%{width:95%} }

        /* controls */
        .controls { display:flex; align-items:center; gap:12px; margin-bottom:18px; flex-wrap:wrap; }
        .search-box { background:var(--surface); border:1px solid var(--border); border-radius:9px; padding:9px 14px; color:var(--text); font-family:inherit; font-size:13px; outline:none; width:260px; transition:border-color .2s; }
        .search-box:focus { border-color:var(--accent); }
        .search-box::placeholder { color:var(--muted); }
        .filter-pills { display:flex; gap:8px; flex-wrap:wrap; }
        .pill { background:var(--surface); border:1px solid var(--border); border-radius:50px; padding:5px 14px; font-size:12px; cursor:pointer; transition:all .2s; color:var(--muted); }
        .pill.active { border-color:var(--accent); color:var(--accent2); background:rgba(108,99,255,.1); }

        /* grid */
        .thumb-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(230px,1fr)); gap:18px; }
        .thumb-card { background:var(--card); border:1px solid var(--border); border-radius:var(--radius); overflow:hidden; transition:transform .25s,box-shadow .25s; }
        .thumb-card:hover { transform:translateY(-3px); box-shadow:0 10px 28px rgba(0,0,0,.4); border-color:rgba(108,99,255,.3); }
        .thumb-img { position:relative; width:100%; padding-top:56.25%; background:#0d0f14; overflow:hidden; }
        .thumb-img img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; transition:transform .3s; }
        .thumb-card:hover .thumb-img img { transform:scale(1.05); }
        .thumb-overlay { position:absolute; inset:0; background:linear-gradient(to top,rgba(0,0,0,.75) 0%,transparent 55%); opacity:0; transition:opacity .25s; display:flex; align-items:flex-end; padding:10px; gap:6px; }
        .thumb-card:hover .thumb-overlay { opacity:1; }
        .ib { width:32px; height:32px; border-radius:8px; border:none; cursor:pointer; display:flex; align-items:center; justify-content:center; font-size:14px; backdrop-filter:blur(6px); background:rgba(255,255,255,.15); color:#fff; transition:all .15s; }
        .ib:hover { filter:brightness(1.3); }
        .cat-dot { position:absolute; top:8px; right:8px; border-radius:6px; padding:3px 8px; font-size:10px; color:#fff; backdrop-filter:blur(4px); background:rgba(0,0,0,.6); font-weight:600; }
        .thumb-body { padding:12px 14px; }
        .thumb-title { font-size:13px; font-weight:600; margin-bottom:3px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .thumb-tag { font-size:11px; color:var(--muted); }
        .empty { text-align:center; padding:50px 20px; color:var(--muted); grid-column:1/-1; }
        .empty-icon { font-size:44px; margin-bottom:12px; }
        .empty h3 { font-size:16px; margin-bottom:6px; color:var(--text); }

        /* toast */
        .toast-wrap { position:fixed; bottom:24px; right:24px; display:flex; flex-direction:column; gap:8px; z-index:999; }
        .toast { background:var(--card); border:1px solid var(--border); border-radius:10px; padding:11px 16px; font-size:13px; display:flex; align-items:center; gap:8px; box-shadow:0 8px 24px rgba(0,0,0,.4); max-width:300px; }
        .toast.success { border-left:3px solid #22c55e; }
        .toast.error   { border-left:3px solid #ef4444; }
        .toast.info    { border-left:3px solid #6c63ff; }

        /* modal */
        .modal-backdrop { position:fixed; inset:0; background:rgba(0,0,0,.65); backdrop-filter:blur(4px); display:flex; align-items:center; justify-content:center; z-index:200; }
        .modal { background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); padding:26px; width:100%; max-width:440px; }
        .modal h2 { font-size:16px; margin-bottom:18px; }
        .mfield { margin-bottom:14px; }
        .modal-actions { display:flex; gap:10px; margin-top:18px; justify-content:flex-end; }

        /* header */
        .stat-bar { display:flex; align-items:center; justify-content:space-between; margin-bottom:24px; flex-wrap:wrap; gap:12px; }
        .stat-bar h2 { font-size:20px; font-weight:700; }
        .stat-pill { background:var(--card); border:1px solid var(--border); border-radius:50px; padding:5px 14px; font-size:12px; color:var(--muted); }
        .stat-pill strong { color:var(--accent2); margin-left:4px; }
        .logout-btn { display:inline-flex; align-items:center; gap:6px; padding:8px 16px; border-radius:9px; border:1px solid rgba(239,68,68,.3); background:rgba(239,68,68,.08); color:#fca5a5; font-family:inherit; font-size:13px; font-weight:600; cursor:pointer; transition:all .2s; }
        .logout-btn:hover { background:#ef4444; color:#fff; border-color:#ef4444; }
        .stat-right { display:flex; align-items:center; gap:10px; }

        /* preset warning */
        .preset-warning { background:rgba(245,158,11,.08); border:1px solid rgba(245,158,11,.3); border-radius:10px; padding:12px 16px; font-size:12px; color:#fcd34d; margin-bottom:18px; line-height:1.6; }
        .preset-warning a { color:#fbbf24; text-decoration:underline; }
      `}</style>

      <div className="admin-wrap">
        {/* Header */}
        <div className="stat-bar">
          <h2>🖼️ Thumbnail Admin</h2>
          <div className="stat-right">
            <div className="stat-pill">Total <strong>{total}</strong></div>
            <button className="logout-btn" onClick={logout}>🚪 Logout</button>
          </div>
        </div>

        {/* ADD FORM */}
        <div className="panel">
          <div className="panel-title">➕ Add New Thumbnail</div>

          {/* Preset setup warning */}
          <div className="preset-warning">
            ⚠️ <strong>One-time setup required for direct upload:</strong> Go to{" "}
            <a href="https://cloudinary.com/console/settings/upload" target="_blank" rel="noreferrer">
              Cloudinary → Settings → Upload Presets
            </a>{" "}
            → Add Upload Preset → set name to <strong>ashufx_unsigned</strong> → set Signing Mode to <strong>Unsigned</strong> → Save.
            You only need to do this once!
          </div>

          <div className="form-grid">
            {/* Left col: image upload */}
            <div>
              <label>Image (Upload or paste URL)</label>
              {/* Upload zone */}
              <div
                className={`upload-zone ${previewUrl ? "has-preview" : ""}`}
                onClick={() => fileRef.current?.click()}
                title="Click to select image"
              >
                {uploading ? (
                  <>
                    <div style={{ fontSize: 24 }}>⏳</div>
                    <div className="upload-hint">Uploading to Cloudinary…</div>
                    <div className="uploading-bar" style={{ width: "100%" }} />
                  </>
                ) : previewUrl ? (
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={previewUrl} alt="Preview" className="preview-img" />
                ) : (
                  <>
                    <div className="upload-icon">📁</div>
                    <div className="upload-hint">Click to upload from your PC<br/><span style={{color:"#475569"}}>JPG, PNG, WEBP — any size</span></div>
                  </>
                )}
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleFileUpload}
              />

              {/* URL field */}
              <div style={{ marginTop: 10 }}>
                <label>Or paste Cloudinary URL directly</label>
                <div className="url-row">
                  <input
                    value={inUrl}
                    onChange={e => { setInUrl(e.target.value); setPreviewUrl(e.target.value); }}
                    placeholder="https://res.cloudinary.com/..."
                  />
                  {inUrl && (
                    <button className="btn btn-ghost" style={{ padding: "10px 12px" }}
                      onClick={() => { setInUrl(""); setPreviewUrl(""); }}>✕</button>
                  )}
                </div>
              </div>
            </div>

            {/* Right col: details */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label>Title *</label>
                <input value={inTitle} onChange={e => setInTitle(e.target.value)} placeholder="e.g. Dark Fury Pack" />
              </div>
              <div>
                <label>Tag / Game Type</label>
                <input value={inTag} onChange={e => setInTag(e.target.value)} placeholder="e.g. FPS · Battle Royale" />
              </div>
              <div>
                <label>Description</label>
                <input value={inDesc} onChange={e => setInDesc(e.target.value)} placeholder="Short description of this thumbnail style…" />
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <label>Price ($ USD)</label>
                  <input
                    type="number" min="1" step="0.5"
                    value={inPrice}
                    onChange={e => setInPrice(e.target.value)}
                    placeholder="6"
                  />
                </div>
                <div style={{ flex: 2 }}>
                  <label>Category</label>
                  <select value={inCat} onChange={e => setInCat(e.target.value as Category)}>
                    <option value="gaming">🎮 Gaming</option>
                    <option value="educational">📚 Educational</option>
                    <option value="etc">✨ ETC</option>
                  </select>
                </div>
              </div>
              <button
                className="btn btn-primary"
                disabled={adding || uploading || !inUrl || !inTitle}
                onClick={addThumbnail}
                style={{ marginTop: "auto" }}
              >
                {adding ? <><div className="spin" /> Adding…</> : "➕ Add to Portfolio"}
              </button>
            </div>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="controls">
          <input
            className="search-box"
            placeholder="🔍 Search thumbnails…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div className="filter-pills">
            {(["all", "gaming", "educational", "etc"] as const).map(c => (
              <div key={c} className={`pill ${filter === c ? "active" : ""}`} onClick={() => setFilter(c)}>
                {c === "all" ? "All" : `${CAT_META[c].icon} ${CAT_META[c].label}`}
              </div>
            ))}
          </div>
        </div>

        {/* GRID */}
        {loading ? (
          <p style={{ color: "var(--muted)", textAlign: "center", padding: 40 }}>Loading…</p>
        ) : (
          <div className="thumb-grid">
            {list.length === 0 ? (
              <div className="empty">
                <div className="empty-icon">{search ? "🔍" : "🖼️"}</div>
                <h3>{search ? "No results" : "No thumbnails yet"}</h3>
                <p>{search ? "Try a different keyword." : "Upload your first thumbnail above."}</p>
              </div>
            ) : list.map(t => {
              const meta = CAT_META[t.category];
              return (
                <div key={t.docId} className="thumb-card">
                  <div className="thumb-img">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={t.url} alt={t.title}
                      onError={e => { (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='225'%3E%3Crect fill='%23161b27' width='400' height='225'/%3E%3Ctext x='50%25' y='50%25' fill='%2364748b' text-anchor='middle' font-size='13' dominant-baseline='middle'%3EImage not found%3C/text%3E%3C/svg%3E"; }}
                    />
                    <div className="thumb-overlay">
                      <button className="ib" title="Copy URL" onClick={() => navigator.clipboard.writeText(t.url).then(() => toast("URL copied!", "success"))}>📋</button>
                      <button className="ib" title="Edit"     onClick={() => setEditItem({ ...t })}>✏️</button>
                      <button className="ib" title="Delete"   onClick={() => deleteThumbnail(t.category, t.docId)}>🗑️</button>
                    </div>
                    <div className="cat-dot" style={{ borderLeft: `3px solid ${meta.color}` }}>
                      {meta.icon} {meta.label.toUpperCase()}
                    </div>
                  </div>
                  <div className="thumb-body">
                    <div className="thumb-title" title={t.title}>{t.title || "Untitled"}</div>
                    <div className="thumb-tag">{t.tag}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* EDIT MODAL */}
      {editItem && (
        <div className="modal-backdrop" onClick={e => { if (e.target === e.currentTarget) setEditItem(null); }}>
          <div className="modal">
            <h2>✏️ Edit Thumbnail</h2>
            <div className="mfield"><label>Title</label>
              <input value={editItem.title} onChange={e => setEditItem(p => p && ({ ...p, title: e.target.value }))}/></div>
            <div className="mfield"><label>Tag / Game Type</label>
              <input value={editItem.tag} onChange={e => setEditItem(p => p && ({ ...p, tag: e.target.value }))}/></div>
            <div className="mfield"><label>Description</label>
              <input value={editItem.description ?? ""} onChange={e => setEditItem(p => p && ({ ...p, description: e.target.value }))} placeholder="Short description…"/></div>
            <div className="mfield"><label>Price ($ USD)</label>
              <input type="number" min="1" step="0.5" value={editItem.price ?? 6} onChange={e => setEditItem(p => p && ({ ...p, price: parseFloat(e.target.value) || 6 }))}/></div>
            <div className="mfield"><label>Cloudinary URL</label>
              <input value={editItem.url} onChange={e => setEditItem(p => p && ({ ...p, url: e.target.value }))}/></div>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setEditItem(null)}>Cancel</button>
              <button className="btn btn-primary" disabled={saving} onClick={saveEdit}>
                {saving ? "Saving…" : "💾 Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOASTS */}
      <div className="toast-wrap">
        {toasts.map(t => (
          <div key={t.id} className={`toast ${t.type}`}>
            {t.type === "success" ? "✅" : t.type === "error" ? "❌" : "ℹ️"} {t.msg}
          </div>
        ))}
      </div>
    </>
  );
}
