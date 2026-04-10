"use client";

import { useEditor } from "tldraw";
import { TldrawUiButton } from "tldraw";
import { useAnalytics } from "@/hooks/useAnalytics";

export default function AddCodeBlockButton() {
  const editor = useEditor();
  const { track } = useAnalytics();

  const handleAdd = () => {
    const bounds = editor.getViewportPageBounds();
    const center = bounds.center;

    editor.createShape({
      type: "code-block",
      x: center.x - 250,
      y: center.y - 150,
      props: {
        w: 500,
        h: 300,
        code: "",
        language: "javascript",
      },
    });

    track("code_block_created");
  };

  return (
    <TldrawUiButton
      type="icon"
      onClick={handleAdd}
      title="Agregar bloque de código"
    >
      +
    </TldrawUiButton>
  );
}
