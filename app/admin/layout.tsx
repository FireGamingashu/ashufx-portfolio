import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin | Ashu FX",
  description: "Admin panel for managing thumbnails.",
  robots: { index: false, follow: false }, // Hide from search engines
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
