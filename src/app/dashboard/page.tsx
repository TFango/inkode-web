"use client";

import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading]);

  if (loading) return <p className="text-white">Cargando...</p>;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
      <h1 className="text-2xl font-bold mb-2">
        Bienvenido, {user?.displayName}
      </h1>
      <p className="text-gray-400 mb-6">{user?.email}</p>
      <button
        onClick={logout}
        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
      >
        Cerrar sesión
      </button>
    </main>
  );
}
