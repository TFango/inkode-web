"use client";

import BoardForm from "@/components/boards/BoardForm/BoardForm";
import BoardList from "@/components/boards/boardList/BoardList";

import { useAuth } from "@/context/authContext";
import { getBoards } from "@/lib/boards";
import { Board } from "@/types/board";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./Boards.module.css";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 12) return "Buenos días";
  if (hour >= 12 && hour < 19) return "Buenas tardes";
  return "Buenas noches";
}

export default function BoardsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [boards, setBoards] = useState<Board[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading]);

  useEffect(() => {
    if (!user) return;
    getBoards(user.uid).then((data) => {
      setBoards(data);
      setReady(true);
    });
  }, [user]);

  const refresh = () => {
    if (!user) return;
    getBoards(user.uid).then(setBoards);
  };

  if (loading) return <p>Cargando...</p>;

  // Nombre de pila solamente
  const firstName = user?.displayName?.split(" ")[0] ?? "";

  return (
    <main className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.info}>
          <div className={styles.titleGroup}>
            <h1 className={styles.title}>
              {getGreeting()}{firstName ? `, ${firstName}` : ""}
            </h1>
            {ready && (
              <span className={styles.boardCount}>
                {boards.length === 0
                  ? "sin tableros"
                  : boards.length === 1
                  ? "1 tablero"
                  : `${boards.length} tableros`}
              </span>
            )}
          </div>
          <BoardForm onCreated={refresh} />
        </div>

        <div className={styles.list}>
          <BoardList boards={boards} ready={ready} onDeleted={refresh} />
        </div>
      </div>
    </main>
  );
}
