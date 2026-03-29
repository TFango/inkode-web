// components/Header.tsx
"use client";

import styles from "./Header.module.css";
import { useAuth } from "@/context/authContext";
import Link from "next/link";

type Props = {
  variant: "login" | "app";
};

export default function Header({ variant }: Props) {
  const { user, logout } = useAuth();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          Inkode
        </Link>

        {variant === "app" && (
          <nav className={styles.nav}>
            <a className={styles.link} href="#">
              Feedback
            </a>
            <a className={styles.link} href="#">
              ¿Qué es Inkode?
            </a>
            <button className={styles.link} onClick={logout}>Cerrar sesión</button>
          </nav>
        )}
      </div>
    </header>
  );
}
