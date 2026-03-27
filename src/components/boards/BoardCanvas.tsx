// components/boards/BoardCanvas.tsx — cliente, con hooks y tldraw
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

const shapeUtils = [CodeBlockShapeUtil];

export default function BoardCanvas({ boardId }: { boardId: string }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<"code" | "draw">("code");

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
            InFrontOfTheCanvas: () => (
              <>
                <ModeToggleButton />
                <ModeController />
                <KeyboardBlocker />
                <AddCodeBlockButton />
                <CanvasPesistence boardId={boardId} />
              </>
            ),
          }}
        />
      </ModeProvider>
    </div>
  );
}
