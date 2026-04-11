"use client";

import { Tldraw } from "tldraw";
import "tldraw/tldraw.css";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CanvasPesistence from "./CanvasPesistence";
import { CodeBlockShapeUtil } from "./CodeBlockShape";
import AddCodeBlockButton from "./AddCodeBlockButton";
import { ModeProvider } from "@/context/modeContext";
import { ModeToggleButton } from "./ModeToggleButton";
import ModeController from "./ModeController";
import KeyboardBlocker from "./KeyboardBlocker";
import { useMode } from "@/context/modeContext";
import { DefaultToolbar } from "tldraw";
import OnboardingTooltip from "./OnboardingTooltip";

const shapeUtils = [CodeBlockShapeUtil];

export default function BoardCanvas({ boardId }: { boardId: string }) {
  const { user, loading, tourCompletado } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<"code" | "draw">("draw");

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading]);

  if (loading) return <p>Cargando...</p>;
  if (!user) return null;

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          boxShadow:
            mode === "code"
              ? "inset 0 0 0 3px var(--color-accent)"
              : "inset 0 0 0 3px var(--color-draw)",
          pointerEvents: "none",
          zIndex: 9999,
        }}
      />
      <ModeProvider value={{ mode, setMode }}>
        <Tldraw
          licenseKey={process.env.NEXT_PUBLIC_TLDRAW_LICENSE_KEY}
          shapeUtils={shapeUtils}
          inferDarkMode
          components={{
            PageMenu: null,
            Toolbar: ConditionalToolbar,
            InFrontOfTheCanvas: () => (
              <>
                {tourCompletado === false && <OnboardingTooltip />}
                <ModeController />
                <KeyboardBlocker />
                <CanvasPesistence boardId={boardId} />
                <div
                  style={{
                    position: "absolute",
                    bottom: 64,
                    left: "50%",
                    transform: "translateX(-50%)",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    zIndex: 1000,
                    pointerEvents: "all",
                    background: "rgba(18, 18, 18, 0.92)",
                    backdropFilter: "blur(10px)",
                    WebkitBackdropFilter: "blur(10px)",
                    padding: "6px 8px",
                    borderRadius: 10,
                    border: "1px solid rgba(42, 42, 42, 0.9)",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
                  }}
                >
                  <ModeToggleButton />
                  {/* Separador */}
                  <div style={{
                    width: 1,
                    height: 18,
                    background: "rgba(42, 42, 42, 0.9)",
                    flexShrink: 0,
                  }} />
                  <AddCodeBlockButton />
                </div>
              </>
            ),
          }}
        />
      </ModeProvider>
    </div>
  );
}

function ConditionalToolbar() {
  const { mode } = useMode();
  if (mode === "code") return null;
  return <DefaultToolbar />;
}
