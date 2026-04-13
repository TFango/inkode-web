"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./BoardCard.module.css";
import { Board } from "@/types/board";
import { setBoardPublic } from "@/lib/boards";

type Props = {
  board: Board;
  onDelete: (id: string) => void;
};

function IconTrash() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2.5 4h11M6 4V2.5h4V4M4.5 4l.75 9h5.5l.75-9" />
    </svg>
  );
}

function IconShare() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 2l4 4-4 4M14 6H6a4 4 0 000 8h1" />
    </svg>
  );
}

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
  const [copied, setCopied] = useState(false);
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

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!board.isPublic) await setBoardPublic(board.id);

    const url = `${process.env.NEXT_PUBLIC_APP_URL}/shared/${board.id}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
      <div className={styles.preview}>
        {lineWidths.map((w, i) => (
          <div key={i} className={styles.codeLine} style={{ width: `${w}%` }} />
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
            <button className={styles.confirmYes} onClick={handleConfirm}>
              Sí
            </button>
            <button className={styles.confirmNo} onClick={handleCancel}>
              No
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", gap: 4 }}>
            <button
              className={
                copied
                  ? styles.shareBtn + " " + styles.shareBtnActive
                  : styles.shareBtn
              }
              onClick={handleShare}
              title={board.isPublic ? "Copiar link" : "Compartir tablero"}
            >
              {copied ? "¡Copiado!" : <IconShare />}
            </button>
            <button
              className={styles.deleteBtn}
              onClick={handleDeleteClick}
              title="Eliminar tablero"
            >
              <IconTrash />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
