"use client";

import { useEffect } from "react";
import { useEditor } from "tldraw";
import { useMode } from "@/context/modeContext";

export default function ModeController() {
  const editor = useEditor();
  const { mode } = useMode();

  useEffect(() => {
    if (mode === "draw") {
      editor.setCurrentTool("draw");
    } else {
      editor.setCurrentTool("select");
    }
  }, [mode, editor]);

  return null;
}
