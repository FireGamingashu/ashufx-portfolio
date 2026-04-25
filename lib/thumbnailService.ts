// Main site reads thumbnails from localStorage (same data admin writes)
export { getAll as fetchAllThumbnails, getByCategory as fetchThumbnailsByCategory } from "./storage";
export type { Thumbnail, Category } from "./storage";
