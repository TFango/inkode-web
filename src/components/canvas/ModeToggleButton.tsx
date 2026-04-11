import { useMode } from "@/context/modeContext";

const C = {
  bg: "rgba(22, 22, 22, 0.92)",
  bgHover: "rgba(32, 32, 32, 0.98)",
  border: "rgba(42, 42, 42, 0.9)",
  text: "#f0f0f0",
  textSec: "#888888",
  accent: "#3b82f6",
  accentBg: "rgba(59, 130, 246, 0.12)",
  draw: "#f97316",
  drawBg: "rgba(249, 115, 22, 0.12)",
  mono: '"JetBrains Mono", monospace',
};

export function ModeToggleButton() {
  const { mode, setMode } = useMode();

  const isCode = mode === "code";
  const color = isCode ? C.accent : C.draw;
  const modeBg = isCode ? C.accentBg : C.drawBg;

  return (
    <button
      onClick={() => setMode(isCode ? "draw" : "code")}
      title={isCode ? "Cambiar a Modo Dibujo" : "Cambiar a Modo Código"}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "6px 12px",
        background: modeBg,
        border: `1px solid ${color}40`,
        borderRadius: 7,
        cursor: "pointer",
        transition: "background 150ms ease, border-color 150ms ease",
        flexShrink: 0,
      }}
    >
      {/* Punto de color — indica el modo ACTUAL */}
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: color,
          boxShadow: `0 0 6px ${color}`,
          flexShrink: 0,
          display: "block",
        }}
      />

      {/* Label del modo actual */}
      <span
        style={{
          fontFamily: C.mono,
          fontSize: "0.75rem",
          fontWeight: 600,
          color: color,
          letterSpacing: "0.02em",
          lineHeight: 1,
          userSelect: "none",
        }}
      >
        {isCode ? "Código" : "Dibujo"}
      </span>

      {/* Flecha que indica que es un toggle */}
      <span
        style={{
          fontFamily: C.mono,
          fontSize: "0.8rem",
          color: `${color}99`,
          lineHeight: 1,
          userSelect: "none",
        }}
      >
        ⇄
      </span>
    </button>
  );
}
