"use client";

import { useEditor, getSnapshot, loadSnapshot } from "tldraw";
import { useEffect } from "react";
import { saveBoardCanvas, loadBoardCanvas } from "@/lib/boards";

const getLocalKey = (boardId: string) => `inkode-canvas-${boardId}`;

type LocalBackup = { snapshot: unknown; savedAt: number };

export default function CanvasPesistence({ boardId }: { boardId: string }) {
  const editor = useEditor();

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    let loaded = false;

    const save = () => {
      if (!loaded) return;
      const snapshot = getSnapshot(editor.store);
      const savedAt = Date.now();

      try {
        const backup: LocalBackup = { snapshot, savedAt };
        localStorage.setItem(getLocalKey(boardId), JSON.stringify(backup));
      } catch {}

      saveBoardCanvas(boardId, snapshot);
    };

    let local: LocalBackup | null = null;
    try {
      const raw = localStorage.getItem(getLocalKey(boardId));
      local = raw ? (JSON.parse(raw) as LocalBackup) : null;
    } catch {
      // Corrupted entry — ignore
    }

    loadBoardCanvas(boardId)
      .then((firestoreData) => {
        let snapshot: unknown = null;
        if (local && firestoreData) {
          // Both exist: use the one saved most recently
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
        // Network error: fall back to localStorage
        if (local?.snapshot) loadSnapshot(editor.store, local.snapshot as any);
      })
      .finally(() => {
        loaded = true;
      });

    const unsubscribe = editor.store.listen(() => {
      if (!loaded) return;
      clearTimeout(timeout);
      timeout = setTimeout(save, 500);
    });

    const handleHide = () => {
      clearTimeout(timeout);
      save();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") handleHide();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleHide);
    // pagehide fires more reliably than beforeunload for back/forward navigation
    window.addEventListener("pagehide", handleHide);

    return () => {
      unsubscribe();
      clearTimeout(timeout);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleHide);
      window.removeEventListener("pagehide", handleHide);
      save();
    };
  }, [boardId]);

  return null;
}
