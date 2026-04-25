// Fetches thumbnails from the Redis-backed API route
// This replaces the old localStorage-based storage.ts approach

export type Category = "gaming" | "educational" | "etc";

export interface Thumbnail {
  id: string;
  url: string;          // Cloudinary URL
  title: string;
  tag: string;
  description: string;
  price: number;
  category: Category;
  createdAt: number;
  docId: string;
}

/** Fetch thumbnails for a specific category from the API */
export async function fetchThumbnailsByCategory(category: Category): Promise<Thumbnail[]> {
  const res = await fetch(`/api/thumbnails?category=${category}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch ${category} thumbnails`);
  return res.json() as Promise<Thumbnail[]>;
}

/** Fetch ALL thumbnails across all categories */
export async function fetchAllThumbnails(): Promise<Thumbnail[]> {
  const res = await fetch("/api/thumbnails", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch thumbnails");
  const db = await res.json() as Record<Category, Thumbnail[]>;
  return Object.values(db).flat();
}
