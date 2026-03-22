"use client";

import { useAuth } from "@/context/authContext";
import { deleteBoard, getBoards } from "@/lib/boards";
import { Board } from "@/types/board";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function BoardList() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    const unsubscribe = getBoards(user.uid, (data) => setBoards(data));

    return () => unsubscribe();
  }, [user]);

  const handleDelete = async (id: string) => {
    setLoading(true);

    try {
      await deleteBoard(id);
    } catch (err) {
      console.error("Error al borrar el tablero", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <div>
        {boards.length === 0 ? (
          <p>No tenes tableros guardados</p>
        ) : (
          boards.map((b: Board) => (
            <div key={b.id}>
              <p>{b.name}</p>
              <button onClick={() => router.push(`/boards/${b.id}`)}>Ingresar</button>
              <button onClick={() => handleDelete(b.id)}>
                {loading ? "Borrando..." : "Borrar"}
              </button>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
