"use client";

import { useEffect } from "react";
import { useMode } from "@/context/modeContext";

export default function KeyboardBlocker() {
  const { mode } = useMode();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInsideMonaco = target?.closest(".monaco-editor") !== null;
      if (isInsideMonaco) {
        e.stopPropagation();
      }
    };

    window.addEventListener("keydown", handler, true);
    window.addEventListener("keyup", handler, true);

    return () => {
      window.removeEventListener("keydown", handler, true);
      window.removeEventListener("keyup", handler, true);
    };
  }, [mode]);

  return null;
}
