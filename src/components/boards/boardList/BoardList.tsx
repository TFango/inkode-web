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
        <svg className={styles.emptyIcon} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="4" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="2"/>
          <rect x="26" y="4" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="2"/>
          <rect x="4" y="26" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="2"/>
          <rect x="26" y="26" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="2"/>
        </svg>
        <p className={styles.emptyTitle}>Todavía no tenés ningún tablero</p>
        <p className={styles.emptySubtitle}>Creá uno con "Nuevo board" para empezar.</p>
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