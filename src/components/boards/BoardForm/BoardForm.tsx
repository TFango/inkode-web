"use client";

import { useAuth } from "@/context/authContext";
import { createBoard } from "@/lib/boards";
import { useEffect, useRef, useState } from "react";
import style from "./BoardForm.module.css";

function IconPlus() {
  return (
    <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
      <path d="M7 1v12M1 7h12" />
    </svg>
  );
}

export default function BoardForm({ onCreated }: { onCreated: () => void }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    inputRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const close = () => {
    setIsOpen(false);
    setName("");
  };

  const handleSubmit = async () => {
    if (!user || !name.trim()) return;

    setLoading(true);

    try {
      await createBoard({ name, userId: user.uid });
      onCreated();
      close();
    } catch (err) {
      console.error("Error al guardar: ", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <button className={style.newBoard} onClick={() => setIsOpen(true)}>
        <span className={style.newBoardIcon}><IconPlus /></span>
        Nuevo tablero
      </button>

      {isOpen && (
        <div className={style.window} onClick={close}>
          <div className={style.container} onClick={(e) => e.stopPropagation()}>
            <div className={style.modalHeader}>
              <h3 className={style.title}>Nuevo tablero</h3>
              <span className={style.titleSub}>canvas infinito · Monaco Editor</span>
            </div>

            <input
              ref={inputRef}
              className={style.input}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Auth flow, API routes, algoritmos..."
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit();
              }}
            />

            <div className={style.buttons}>
              <button
                onClick={handleSubmit}
                disabled={loading || !name.trim()}
                className={style.create}
              >
                {loading ? "Creando..." : "Crear tablero"}
              </button>

              <button className={style.cancel} onClick={close}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
