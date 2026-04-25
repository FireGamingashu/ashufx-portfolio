"use client";
import { useDevToolsProtection } from "@/hooks/useDevToolsProtection";

export default function ProtectionWrapper({ children }: { children: React.ReactNode }) {
  useDevToolsProtection();
  return <>{children}</>;
}
