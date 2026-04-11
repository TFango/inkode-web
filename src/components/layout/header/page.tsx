"use client";

import styles from "./Header.module.css";
import { useAuth } from "@/context/authContext";
import { actualizaciones } from "@/data/actualizaciones";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  variant: "login" | "app";
};

// El punto de novedades aparece si la última versión tiene menos de 7 días
function hasRecentUpdate(): boolean {
  const latest = actualizaciones[0];
  if (!latest) return false;
  const diff = Date.now() - new Date(latest.date).getTime();
  return diff < 7 * 24 * 60 * 60 * 1000;
}

function IconLogout() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2H3a1 1 0 00-1 1v10a1 1 0 001 1h3" />
      <path d="M10.5 11L14 8l-3.5-3" />
      <path d="M14 8H6" />
    </svg>
  );
}

export default function Header({ variant }: Props) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const showNoveltyDot = hasRecentUpdate();
  const isOnNovedades = pathname === "/actualizaciones";

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Logo */}
        <Link href="/boards" className={styles.logo}>
          <span className={styles.logoAccent}>in</span>kode
        </Link>

        {variant === "app" && (
          <nav className={styles.nav}>
            {/* Novedades — con punto pulsante si hay update reciente */}
            <Link
              className={`${styles.link} ${isOnNovedades ? styles.linkActive : ""}`}
              href="/actualizaciones"
            >
              {showNoveltyDot && (
                <span className={styles.noveltyDot} aria-hidden="true" />
              )}
              Novedades
            </Link>

            {/* Feedback */}
            <Link
              className={`${styles.link} ${pathname === "/feedback" ? styles.linkActive : ""}`}
              href="/feedback"
            >
              Feedback
            </Link>

            {/* Separador */}
            <div className={styles.sep} aria-hidden="true" />

            {/* Avatar → cuenta */}
            <Link
              href="/account"
              className={`${styles.avatarLink} ${pathname === "/account" ? styles.avatarLinkActive : ""}`}
              title={user?.displayName ?? "Mi cuenta"}
            >
              <img
                src={user?.photoURL ?? "/logos/profile.png"}
                alt={user?.displayName ?? "cuenta"}
                className={styles.avatarImg}
                onError={(e) => {
                  e.currentTarget.src = "/logos/profile.png";
                }}
              />
            </Link>

            {/* Logout — ícono bajo perfil */}
            <button
              className={styles.logoutBtn}
              onClick={logout}
              title="Cerrar sesión"
            >
              <IconLogout />
            </button>
          </nav>
        )}
      </div>
    </header>
  );
}
