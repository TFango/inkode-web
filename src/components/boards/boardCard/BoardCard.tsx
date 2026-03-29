"use client";

import { useRouter } from "next/navigation";
import styles from "./BoardCard.module.css";
import { Board } from "@/types/board";

type Props = {
  board: Board;
  onDelete: (id: string) => void;
};

export default function BoardCard({ board, onDelete }: Props) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/boards/${board.id}`);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // evita navegar al canvas al hacer click en eliminar
    onDelete(board.id);
  };

  const formattedDate = board.createdAt?.toDate().toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
  });

  return (
    <div className={styles.card} onClick={handleClick}>
      <div className={styles.preview}>
        <span className={styles.previewName}>{board.name}</span>
      </div>

      <div className={styles.footer}>
        <div className={styles.info}>
          <span className={styles.name}>{board.name}</span>
          <span className={styles.date}>{formattedDate}</span>
        </div>
        <button
          className={styles.deleteBtn}
          onClick={handleDelete}
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}