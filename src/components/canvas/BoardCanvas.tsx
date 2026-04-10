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
                    bottom: 60,
                    left: "50%",
                    transform: "translateX(-50%)",
                    display: "flex",
                    gap: 8,
                    zIndex: 1000,
                    pointerEvents: "all",
                    background: "rgba(30,30,30,0.9)",
                    padding: "6px 12px",
                    borderRadius: 8,
                  }}
                >
                  <ModeToggleButton />
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
