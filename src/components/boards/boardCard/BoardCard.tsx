"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import styles from "./BoardCard.module.css";
import { Board } from "@/types/board";
import { setBoardPublic } from "@/lib/boards";

type Props = {
  board: Board;
  onDelete: (id: string) => void;
};

function IconTrash() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2.5 4h11M6 4V2.5h4V4M4.5 4l.75 9h5.5l.75-9" />
    </svg>
  );
}

function IconShare() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 2l4 4-4 4M14 6H6a4 4 0 000 8h1" />
    </svg>
  );
}

function IconDots() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      width="14"
      height="14"
    >
      <circle cx="3" cy="8" r="1.5" />
      <circle cx="8" cy="8" r="1.5" />
      <circle cx="13" cy="8" r="1.5" />
    </svg>
  );
}

function getLineWidths(seed: string): number[] {
  const base = [62, 45, 78, 30, 55, 40, 68];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) & 0xffff;
  }
  return base.map((w, i) => {
    const offset = ((hash >> i) & 0x1f) - 15; // ±15%
    return Math.min(90, Math.max(20, w + offset));
  });
}

export default function BoardCard({ board, onDelete }: Props) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const lineWidths = getLineWidths(board.name);

  const handleClick = () => {
    if (menuOpen || confirming) return;
    router.push(`/boards/${board.id}`);
  };

  const handleMenuToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen((prev) => !prev);
    setConfirming(false);
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!board.isPublic) await setBoardPublic(board.id);

    const url = `${process.env.NEXT_PUBLIC_APP_URL}/shared/${board.id}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      setMenuOpen(false);
    }, 1500);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirming(true);
  };

  const handleConfirm = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(board.id);
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirming(false);
  };

  // Cerrar menú al hacer click fuera
  useEffect(() => {
    if (!menuOpen) return;
    const handleOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
        setConfirming(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [menuOpen]);

  const formattedDate = board.createdAt?.toDate().toLocaleDateString("es-AR", {
    day: "numeric",
    month: "short",
  });

  return (
    <div
      className={styles.card}
      onClick={handleClick}
      onMouseLeave={() => {
        if (!menuOpen) setConfirming(false);
      }}
    >
      <div className={styles.preview}>
        {lineWidths.map((w, i) => (
          <div key={i} className={styles.codeLine} style={{ width: `${w}%` }} />
        ))}
        <div className={styles.previewMode}>
          <div className={styles.previewModeDot} />
          canvas
        </div>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <div className={styles.info}>
          <span className={styles.name}>{board.name}</span>
          <span className={styles.date}>{formattedDate}</span>
        </div>

        <div className={styles.menuWrapper} ref={menuRef}>
          <button
            className={`${styles.menuBtn}${menuOpen ? " " + styles.menuBtnActive : ""}`}
            onClick={handleMenuToggle}
            title="Opciones"
          >
            <IconDots />
          </button>

          {menuOpen && (
            <div className={styles.dropdown} onClick={(e) => e.stopPropagation()}>
              {/* Opción compartir */}
              <button className={styles.dropdownItem} onClick={handleShare}>
                <span className={styles.dropdownIcon}><IconShare /></span>
                <span>{copied ? "¡Copiado!" : board.isPublic ? "Copiar link" : "Compartir tablero"}</span>
              </button>

              {/* Opción eliminar — con confirm inline */}
              {confirming ? (
                <div className={styles.confirmRow}>
                  <span className={styles.confirmText}>¿Eliminar?</span>
                  <button className={styles.confirmYes} onClick={handleConfirm}>Sí</button>
                  <button className={styles.confirmNo} onClick={handleCancel}>No</button>
                </div>
              ) : (
                <button
                  className={`${styles.dropdownItem} ${styles.dropdownItemDanger}`}
                  onClick={handleDeleteClick}
                >
                  <span className={styles.dropdownIcon}><IconTrash /></span>
                  <span>Eliminar tablero</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
