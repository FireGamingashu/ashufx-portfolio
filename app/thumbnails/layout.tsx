import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thumbnails | Ashu FX",
  description:
    "Browse premium gaming, educational, and creative thumbnails by Ashu FX. High-quality designs for every content creator.",
};

export default function ThumbnailsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
