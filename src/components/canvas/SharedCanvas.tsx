"use client";

import { Tldraw } from "tldraw";
import "tldraw/tldraw.css";
import { useEffect, useState } from "react";
import { CodeBlockShapeUtil } from "./CodeBlockShape";
import { loadBoardCanvas } from "@/lib/boards";
import SharedBadge from "./SharedBadge";

const shapeUtils = [CodeBlockShapeUtil];

export default function SharedCanvas({
  boardId,
  name,
}: {
  boardId: string;
  name: string;
}) {
  const [snap, setSnap] = useState<unknown>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function cargar() {
      try {
        const board = await loadBoardCanvas(boardId);
        setSnap(board?.snapshot);
      } catch (err) {
        setError(true);
      }
    }
    cargar();
  }, [boardId]);

  if (error) {
    return <p>Este tablero no esta disponible</p>;
  }

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Tldraw
        licenseKey={process.env.NEXT_PUBLIC_TLDRAW_LICENSE_KEY}
        shapeUtils={shapeUtils}
        inferDarkMode
        snapshot={snap as any}
        components={{
          PageMenu: null,
          Toolbar: null,
          HelperButtons: null,
          NavigationPanel: null,
        }}
      />
      <SharedBadge />
    </div>
  );
}
