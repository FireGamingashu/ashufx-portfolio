// ============================================================
//  localStorage helper for Ashu FX thumbnails
//  No database, no backend — all stored in browser!
// ============================================================

export type Category = "gaming" | "educational" | "etc";

export interface Thumbnail {
  id: string;           // auto: thumb1, thumb2, ...
  title: string;
  description: string;
  price: number;
  category: Category;
  imageUrl: string;     // Cloudinary URL
  createdAt: number;
}

const KEY = "ashufx_thumbnails";

/** Read all thumbnails from localStorage */
export function getAll(): Thumbnail[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Thumbnail[]) : [];
  } catch {
    return [];
  }
}

/** Save the full list back to localStorage */
function saveAll(list: Thumbnail[]): void {
  localStorage.setItem(KEY, JSON.stringify(list));
}

/** Get next available id (thumb1, thumb2 …) */
function nextId(list: Thumbnail[]): string {
  const nums = list
    .map((t) => parseInt(t.id.replace("thumb", ""), 10))
    .filter((n) => !isNaN(n));
  return `thumb${nums.length ? Math.max(...nums) + 1 : 1}`;
}

/** Add a new thumbnail and return it */
export function addThumb(data: Omit<Thumbnail, "id" | "createdAt">): Thumbnail {
  const list = getAll();
  const thumb: Thumbnail = { ...data, id: nextId(list), createdAt: Date.now() };
  saveAll([thumb, ...list]);
  return thumb;
}

/** Update fields of an existing thumbnail by id */
export function updateThumb(id: string, data: Partial<Thumbnail>): void {
  saveAll(getAll().map((t) => (t.id === id ? { ...t, ...data } : t)));
}

/** Delete a thumbnail by id */
export function deleteThumb(id: string): void {
  saveAll(getAll().filter((t) => t.id !== id));
}

/** Get thumbnails filtered by category */
export function getByCategory(cat: Category): Thumbnail[] {
  return getAll().filter((t) => t.category === cat);
}
