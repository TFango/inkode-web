"use client";

import BoardForm from "@/components/boards/BoardForm";
import BoardList from "@/components/boards/BoardList";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

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
    <main>
      <div>
        <div>
          <h1>Bienvenido, {user?.displayName}</h1>
          <p>{user?.email}</p>
          <button onClick={logout}>Cerrar sesion</button>
        </div>

        <div>
          <BoardForm />
          <BoardList />
        </div>
      </div>
    </main>
  );
}
