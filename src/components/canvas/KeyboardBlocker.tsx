"use client";

import { useEffect } from "react";
import { useEditor } from "tldraw";

export default function KeyboardBlocker() {
  const editor = useEditor();

  useEffect(() => {
    const container = editor.getContainer();

    const handler = (e: KeyboardEvent) => {
      const active = document.activeElement;
      const isInsideMonaco = active?.closest(".monaco-editor") !== null;
      if (isInsideMonaco) {
        e.stopImmediatePropagation();
      }
    };

    container.addEventListener("keydown", handler, true);
    container.addEventListener("keyup", handler, true);

    return () => {
      container.removeEventListener("keydown", handler, true);
      container.removeEventListener("keyup", handler, true);
    };
  }, [editor]);

  return null;
}
