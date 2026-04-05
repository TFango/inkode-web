"use client";

import { useEditor, getSnapshot, loadSnapshot } from "tldraw";
import { useEffect } from "react";
import { saveBoardCanvas, loadBoardCanvas } from "@/lib/boards";

const getLocalKey = (boardId: string) => `inkode-canvas-${boardId}`;

type LocalBackup = { snapshot: unknown; savedAt: number };

export default function CanvasPesistence({ boardId }: { boardId: string }) {
  const editor = useEditor();

  useEffect(() => {
    let localTimeout: NodeJS.Timeout;
    let loaded = false;

    const saveLocal = () => {
      if (!loaded) return;
      const snapshot = getSnapshot(editor.store);
      const savedAt = Date.now();
      try {
        const backup: LocalBackup = { snapshot, savedAt };
        localStorage.setItem(getLocalKey(boardId), JSON.stringify(backup));
      } catch {}
    };

    const saveFirestore = () => {
      if (!loaded) return;
      const snapshot = getSnapshot(editor.store);
      saveBoardCanvas(boardId, snapshot);
    };

    // Carga inicial: localStorage vs Firestore, gana el más reciente
    let local: LocalBackup | null = null;
    try {
      const raw = localStorage.getItem(getLocalKey(boardId));
      local = raw ? (JSON.parse(raw) as LocalBackup) : null;
    } catch {}

    loadBoardCanvas(boardId)
      .then((firestoreData) => {
        let snapshot: unknown = null;
        if (local && firestoreData) {
          snapshot =
            local.savedAt >= firestoreData.savedAt
              ? local.snapshot
              : firestoreData.snapshot;
        } else {
          snapshot = local?.snapshot ?? firestoreData?.snapshot ?? null;
        }
        if (snapshot) loadSnapshot(editor.store, snapshot as any);
      })
      .catch(() => {
        if (local?.snapshot) loadSnapshot(editor.store, local.snapshot as any);
      })
      .finally(() => {
        loaded = true;
      });

    // localStorage: se guarda con debounce de 500ms mientras edita
    const unsubscribe = editor.store.listen(() => {
      if (!loaded) return;
      clearTimeout(localTimeout);
      localTimeout = setTimeout(saveLocal, 500);
    });

    // Firestore: solo al salir del canvas
    const handleExit = () => {
      clearTimeout(localTimeout);
      saveLocal();
      saveFirestore();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") handleExit();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleExit);
    window.addEventListener("pagehide", handleExit);

    return () => {
      unsubscribe();
      clearTimeout(localTimeout);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleExit);
      window.removeEventListener("pagehide", handleExit);
      handleExit();
    };
  }, [boardId]);

  return null;
}