"use client";

import { useAuth } from "@/context/authContext";
import { createBoard } from "@/lib/boards";
import { useState } from "react";
import style from "./BoardForm.module.css";

export default function BoardForm() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async () => {
    if (!user || !name.trim()) return;

    setLoading(true);

    try {
      await createBoard({ name, userId: user.uid });
      setName("");
      setIsOpen(false);
    } catch (err) {
      console.error("Error al guardar: ", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <button className={style.newBoard} onClick={() => setIsOpen(true)}>
        Nuevo board
      </button>

      {isOpen && (
        <div className={style.window}>
          <div className={style.container}>
            <h3 className={style.title}>Crear tablero</h3>

            <input
              className={style.input}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre del tablero"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit();
              }}
            />

            <div className={style.buttons}>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={style.create}
              >
                {loading ? "Creando..." : "Crear"}
              </button>

              <button className={style.cancel} onClick={() => setIsOpen(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
