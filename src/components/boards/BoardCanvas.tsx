// components/boards/BoardCanvas.tsx — cliente, con hooks y tldraw
"use client";

import { Tldraw } from "tldraw";
import "tldraw/tldraw.css";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import CanvasPesistence from "../canvas/CanvasPesistence";
import { CodeBlockShapeUtil } from "../canvas/CodeBlockShape";
import AddCodeBlockButton from "../canvas/AddCodeBlockButton";

const shapeUtils = [CodeBlockShapeUtil];

export default function BoardCanvas({ boardId }: { boardId: string }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading]);

  if (loading) return <p>Cargando...</p>;
  if (!user) return null;

  return (
    <div className="tldraw__editor" style={{ width: "100vw", height: "100vh" }}>
      <Tldraw
        shapeUtils={shapeUtils}
        inferDarkMode
        components={{
          InFrontOfTheCanvas: () => (
            <>
              <AddCodeBlockButton />
              <CanvasPesistence boardId={boardId} />
            </>
          ),
        }}
      />
    </div>
  );
}
