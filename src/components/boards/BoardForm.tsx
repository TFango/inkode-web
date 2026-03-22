"use client";

import { useAuth } from "@/context/authContext";
import { createBoard } from "@/lib/boards";
import { useState } from "react";

export default function BoardForm() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async () => {
    if (!user) return;
    setLoading(true);

    try {
      await createBoard({ name, userId: user.uid });

      setName("");
    } catch (err) {
      console.error("Error al guardar: ", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <div>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ingrese el nombre del tablero"
        />

        <button onClick={handleSubmit} disabled={loading}>
          {loading ? "Creando..." : "Crear"}
        </button>
      </div>
    </section>
  );
}
