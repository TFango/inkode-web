"use client";

import BoardForm from "@/components/boards/BoardForm/BoardForm";
import BoardList from "@/components/boards/boardList/BoardList";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import styles from "./Boards.module.css";

export default function BoardsPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading]);

  if (loading) return <p>Cargando...</p>;

  return (
    <main className={styles.hero}>
      <div className={styles.container}>

        <div className={styles.info}>
          <h1 className={styles.title}>Bienvenido de vuelta, {user?.displayName}</h1>

          <BoardForm />
        </div>

        <div className={styles.list}>
          <BoardList />
        </div>
      </div>
    </main>
  );
}
