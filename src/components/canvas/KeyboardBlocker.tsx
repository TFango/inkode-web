"use client";

import { useEffect } from "react";
import { useMode } from "@/context/modeContext";

export default function KeyboardBlocker() {
  const { mode } = useMode();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (mode === "code") {
        e.stopPropagation();
      }
    };

    window.addEventListener("keydown", handler, true);

    return () => {
      window.removeEventListener("keydown", handler, true);
    };
  }, [mode]);

  return null;
}
