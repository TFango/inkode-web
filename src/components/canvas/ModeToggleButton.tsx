import { useMode } from "@/context/modeContext";
import { TldrawUiButton } from "tldraw";

export function ModeToggleButton() {
  const { mode, setMode } = useMode();

  return (
    <TldrawUiButton
      type="icon"
      onClick={() => setMode(mode === "code" ? "draw" : "code")}
      title={
        mode === "code" ? "Cambiar a Modo dibujo" : "Cambiar a Modo código"
      }
    >
      {mode === "code" ? "Dibujo" : "Código"}
    </TldrawUiButton>
  );
}
