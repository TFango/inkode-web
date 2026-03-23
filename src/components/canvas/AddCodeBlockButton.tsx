"use client";

import { useEditor } from "tldraw";

export default function AddCodeBlockButton() {
  const editor = useEditor();

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

    console.log("shape creada");
  };

  return (
    <div
      style={{
        position: "absolute",
        top: 16,
        left: 500,
        zIndex: 1000,
        pointerEvents: "all",
      }}
    >
      <button
        onClick={handleAdd}
        style={{
          background: "red",
          color: "white",
          padding: "10px 14px",
          borderRadius: 8,
          cursor: "pointer",
          pointerEvents: "all",
        }}
      >
        + Agregar bloque
      </button>
    </div>
  );
}
