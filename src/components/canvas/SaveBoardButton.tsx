"use client";

import { useAuth } from "@/context/authContext";
import { createBoard, saveBoardCanvas } from "@/lib/boards";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./SharedCanvas.module.css";

type Props = {
  boardId: string;
  boardName: string;
  snapshot: unknown;
};

function IconSave() {
  return (
    <svg
      viewBox="0 0 16 16"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 14h12V5.5L10.5 2H2v12z" />
      <path d="M5 2v4h6V2" />
      <path d="M4 14v-4h8v4" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg
      viewBox="0 0 16 16"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 8l3.5 3.5L13 4.5" />
    </svg>
  );
}

export default function SaveBoardButton({ boardName, snapshot }: Props) {
  const [saved, setSaved] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const handleSave = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    const id = await createBoard({ name: boardName, userId: user.uid });
    await saveBoardCanvas(id, snapshot);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <button
      className={`${styles.saveBtn}${saved ? " " + styles.saveBtnSaved : ""}`}
      onClick={handleSave}
      disabled={saved}
    >
      <span className={styles.saveBtnIcon}>
        {saved ? <IconCheck /> : <IconSave />}
      </span>
      {saved ? "¡Guardado en tu cuenta!" : "Guardar en mi cuenta"}
    </button>
  );
}
