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
    <button className={styles.saveBtn} onClick={handleSave}>
      {saved ? "¡Guardado!" : "Guardar en mi cuenta"}
    </button>
  );
}
