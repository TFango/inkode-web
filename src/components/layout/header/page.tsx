"use client";

import styles from "./Header.module.css";
import { useAuth } from "@/context/authContext";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  variant: "login" | "app";
};

export default function Header({ variant }: Props) {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/boards" className={styles.logo}>
          Inkode
        </Link>

        {variant === "app" && (
          <nav className={styles.nav}>
            <Link
              className={`${styles.link} ${pathname === "/feedback" ? styles.linkActive : ""}`}
              href="/feedback"
            >
              Feedback
            </Link>

            <Link
              href="/account"
              className={`${styles.avatarLink} ${pathname === "/account" ? styles.avatarLinkActive : ""}`}
              title="Mi cuenta"
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

            <button className={styles.logoutBtn} onClick={logout}>
              Cerrar sesión
            </button>
          </nav>
        )}
      </div>
    </header>
  );
}
