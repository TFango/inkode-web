import { useMode } from "@/context/modeContext";

export function ModeToggleButton() {
  const { mode, setMode } = useMode();

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
        onClick={() => setMode(mode === "code" ? "draw" : "code")}
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          zIndex: 9999,
          pointerEvents: "all",
        }}
      >
        {mode === "code" ? "Modo dibujo" : "Modo código"}
      </button>
    </div>
  );
}
