"use client";

import { deleteBoard } from "@/lib/boards";
import { Board } from "@/types/board";
import BoardCard from "../boardCard/BoardCard";
import styles from "./BoardList.module.css";

type Props = {
  boards: Board[];
  ready: boolean;
  onDeleted: () => void;
};

function IconGrid() {
  return (
    <svg className={styles.emptyIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

export default function BoardList({ boards, ready, onDeleted }: Props) {
  const handleDelete = async (id: string) => {
    try {
      await deleteBoard(id);
      onDeleted();
    } catch (err) {
      console.error("Error al borrar el tablero", err);
    }
  };

  if (!ready) return null;

  if (boards.length === 0) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIconWrap}>
          <IconGrid />
        </div>
        <p className={styles.emptyTitle}>Todavía no tenés tableros</p>
        <p className={styles.emptySubtitle}>Creá uno con "Nuevo tablero" para empezar.</p>
      </div>
    );
  }

  return (
    <section className={styles.boards}>
      {boards.map((b: Board) => (
        <BoardCard key={b.id} board={b} onDelete={handleDelete} />
      ))}
    </section>
  );
}
