"use client";

import { useEditor } from "tldraw";
import { useAnalytics } from "@/hooks/useAnalytics";

const C = {
  text:         "#888888",
  textHover:    "#f0f0f0",
  border:       "rgba(42, 42, 42, 0.9)",
  borderHover:  "rgba(136, 136, 136, 0.35)",
  mono:         '"JetBrains Mono", monospace',
};

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
    <button
      onClick={handleAdd}
      title="Agregar bloque de código"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 30,
        height: 30,
        background: "transparent",
        border: `1px solid ${C.border}`,
        borderRadius: 7,
        cursor: "pointer",
        color: C.text,
        flexShrink: 0,
        transition: "color 150ms ease, border-color 150ms ease, background 150ms ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = C.textHover;
        e.currentTarget.style.borderColor = C.borderHover;
        e.currentTarget.style.background = "rgba(255,255,255,0.04)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = C.text;
        e.currentTarget.style.borderColor = C.border;
        e.currentTarget.style.background = "transparent";
      }}
    >
      {/* Ícono + SVG */}
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      >
        <path d="M7 2v10M2 7h10" />
      </svg>
    </button>
  );
}
