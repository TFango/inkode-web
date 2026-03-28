"use client";

import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const { user, loading, loginWithGoogle } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/boards");
    }
  }, [user, loading]);

  return (
    <main className="min-h-screen bg-black">
      <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
        <h1 className="text-4xl font-bold mb-2">Inkoed</h1>
        <p className="text-gray-400 mb-8">Tu canvas de codigo</p>
        <button
          onClick={loginWithGoogle}
          className="bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition"
        >
          Entrar con google
        </button>
      </div>
    </main>
  );
}
