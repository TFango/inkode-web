"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./BoardCard.module.css";
import { Board } from "@/types/board";

type Props = {
  board: Board;
  onDelete: (id: string) => void;
};

export default function BoardCard({ board, onDelete }: Props) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);

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
    month: "long",
  });

  return (
    <div
      className={styles.card}
      onClick={handleClick}
      onMouseLeave={() => setConfirming(false)}
    >
      <div className={styles.preview}>
        <span className={styles.previewName}>{board.name}</span>
      </div>

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
          <button className={styles.deleteBtn} onClick={handleDeleteClick}>
            Eliminar
          </button>
        )}
      </div>
    </div>
  );
}