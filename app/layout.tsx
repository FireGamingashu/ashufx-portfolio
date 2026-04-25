import type { Metadata } from "next";
import "./globals.css";
import ProtectionWrapper from "./components/ProtectionWrapper";

export const metadata: Metadata = {
  title: "Ashu FX — Premium Thumbnail Design & Creative Visual Services",
  description:
    "Ashu FX crafts high-converting YouTube thumbnails, gaming intros, and creative visual content that stops the scroll. Order your premium thumbnail for $6.",
  keywords: "thumbnail design, youtube thumbnails, gaming thumbnail, creative design, Ashu FX",
  openGraph: {
    title: "Ashu FX — Premium Thumbnail Design",
    description: "High-converting YouTube thumbnails that stop the scroll. Starting at $6.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ProtectionWrapper>
          {children}
        </ProtectionWrapper>
      </body>
    </html>
  );
}
