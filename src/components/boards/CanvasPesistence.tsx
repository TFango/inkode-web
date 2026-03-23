"use client";

import { useEditor } from "tldraw";
import { useEffect } from "react";
import { saveBoardCanvas, loadBoardCanvas } from "@/lib/boards";

export default function CanvasPesistence({ boardId }: { boardId: string }) {
  const editor = useEditor();

  useEffect(() => {
    loadBoardCanvas(boardId).then((snapshot) => {
      if (snapshot) editor.store.loadStoreSnapshot(snapshot as any);
    });

    let timeout: NodeJS.Timeout;
    const unsubscribe = editor.store.listen(() => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        console.log("guardado");

        const snapshot = editor.store.getStoreSnapshot();
        saveBoardCanvas(boardId, snapshot);
      }, 2000);
    });

    return () => {
      unsubscribe();
      clearTimeout(timeout);
    };
  }, [boardId]);

  return null;
}
