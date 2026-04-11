"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./BoardCard.module.css";
import { Board } from "@/types/board";

type Props = {
  board: Board;
  onDelete: (id: string) => void;
};

function IconTrash() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 4h11M6 4V2.5h4V4M4.5 4l.75 9h5.5l.75-9" />
    </svg>
  );
}

// Genera un patrón de anchos "pseudoaleatorio" basado en el nombre del tablero
// para que cada card tenga líneas de código distintas
function getLineWidths(seed: string): number[] {
  const base = [62, 45, 78, 30, 55, 40, 68];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) & 0xffff;
  }
  return base.map((w, i) => {
    const offset = ((hash >> i) & 0x1f) - 15; // ±15%
    return Math.min(90, Math.max(20, w + offset));
  });
}

export default function BoardCard({ board, onDelete }: Props) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const lineWidths = getLineWidths(board.name);

  const handleClick = () => {
    if (confirming) return;
    router.push(`/boards/${board.id}`);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirming(true);
  };

  const handleConfirm = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(board.id);
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirming(false);
  };

  const formattedDate = board.createdAt?.toDate().toLocaleDateString("es-AR", {
    day: "numeric",
    month: "short",
  });

  return (
    <div
      className={styles.card}
      onClick={handleClick}
      onMouseLeave={() => setConfirming(false)}
    >
      {/* Preview — canvas simulado */}
      <div className={styles.preview}>
        {lineWidths.map((w, i) => (
          <div
            key={i}
            className={styles.codeLine}
            style={{ width: `${w}%` }}
          />
        ))}
        <div className={styles.previewMode}>
          <div className={styles.previewModeDot} />
          canvas
        </div>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <div className={styles.info}>
          <span className={styles.name}>{board.name}</span>
          <span className={styles.date}>{formattedDate}</span>
        </div>

        {confirming ? (
          <div className={styles.confirm}>
            <span className={styles.confirmText}>¿Eliminar?</span>
            <button className={styles.confirmYes} onClick={handleConfirm}>Sí</button>
            <button className={styles.confirmNo} onClick={handleCancel}>No</button>
          </div>
        ) : (
          <button
            className={styles.deleteBtn}
            onClick={handleDeleteClick}
            title="Eliminar tablero"
          >
            <IconTrash />
          </button>
        )}
      </div>
    </div>
  );
}
