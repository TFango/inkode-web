"use client";

import { Tldraw } from "tldraw";
import "tldraw/tldraw.css";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CanvasPesistence from "../canvas/CanvasPesistence";
import { CodeBlockShapeUtil } from "../canvas/CodeBlockShape";
import AddCodeBlockButton from "../canvas/AddCodeBlockButton";
import { ModeProvider } from "@/context/modeContext";
import { ModeToggleButton } from "../canvas/ModeToggleButton";
import ModeController from "../canvas/ModeController";
import KeyboardBlocker from "../canvas/KeyboardBlocker";
import { useMode } from "@/context/modeContext";
import { DefaultToolbar } from "tldraw";

const shapeUtils = [CodeBlockShapeUtil];

export default function BoardCanvas({ boardId }: { boardId: string }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<"code" | "draw">("draw");

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading]);

  if (loading) return <p>Cargando...</p>;
  if (!user) return null;

  return (
    <div className="tldraw__editor" style={{ width: "100vw", height: "100vh" }}>
      <ModeProvider value={{ mode, setMode }}>
        <Tldraw
          shapeUtils={shapeUtils}
          inferDarkMode
          components={{
            Toolbar: ConditionalToolbar,
            InFrontOfTheCanvas: () => (
              <>
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


