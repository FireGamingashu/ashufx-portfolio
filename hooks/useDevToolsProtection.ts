"use client";
// ────────────────────────────────────────────────────────────
//  🛡️  DevTools / Right-click / F12 Protection Hook
//  Attach once in layout or a top-level client component.
//  This is a deterrent layer — not cryptographic security.
// ────────────────────────────────────────────────────────────
import { useEffect } from "react";

export function useDevToolsProtection() {
  useEffect(() => {
    // 1. Disable right-click context menu
    const blockContextMenu = (e: MouseEvent) => e.preventDefault();

    // 2. Block common DevTools keyboard shortcuts
    const blockKeys = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const ctrl = e.ctrlKey || e.metaKey;

      if (
        e.key === "F12" ||
        (ctrl && e.shiftKey && (key === "i" || key === "j" || key === "c")) ||
        (ctrl && key === "u") ||   // View source
        (ctrl && key === "s")      // Save page
      ) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    // 3. Detect DevTools open via window size deviation
    let devtoolsOpen = false;
    const threshold = 160;
    const detectDevTools = () => {
      const widthDiff = window.outerWidth - window.innerWidth;
      const heightDiff = window.outerHeight - window.innerHeight;
      if (widthDiff > threshold || heightDiff > threshold) {
        if (!devtoolsOpen) {
          devtoolsOpen = true;
          // Blur/redirect when devtools detected
          document.body.style.filter = "blur(8px)";
          document.body.style.pointerEvents = "none";
        }
      } else {
        if (devtoolsOpen) {
          devtoolsOpen = false;
          document.body.style.filter = "";
          document.body.style.pointerEvents = "";
        }
      }
    };

    const interval = setInterval(detectDevTools, 1000);

    // 4. Disable text selection
    document.body.style.userSelect = "none";
    document.body.style.webkitUserSelect = "none";

    document.addEventListener("contextmenu", blockContextMenu);
    document.addEventListener("keydown", blockKeys);

    return () => {
      document.removeEventListener("contextmenu", blockContextMenu);
      document.removeEventListener("keydown", blockKeys);
      clearInterval(interval);
      document.body.style.filter = "";
      document.body.style.pointerEvents = "";
      document.body.style.userSelect = "";
      document.body.style.webkitUserSelect = "";
    };
  }, []);
}
