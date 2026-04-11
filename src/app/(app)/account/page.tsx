"use client";

import { useAuth } from "@/context/authContext";
import styles from "./Account.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function IconName() {
  return (
    <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="7" cy="5" r="2.5" />
      <path d="M2 12c0-2.8 2.2-5 5-5s5 2.2 5 5" />
    </svg>
  );
}

function IconEmail() {
  return (
    <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1.5" y="3" width="11" height="8" rx="1.5" />
      <path d="M1.5 5l5.5 3.5L12.5 5" />
    </svg>
  );
}

function IconCalendar() {
  return (
    <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1.5" y="2.5" width="11" height="10" rx="1.5" />
      <path d="M1.5 6h11M5 1v3M9 1v3" />
    </svg>
  );
}

function IconShield() {
  return (
    <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 1.5L2 3.5v4c0 2.8 2.2 4.8 5 5.5 2.8-.7 5-2.7 5-5.5v-4L7 1.5z" />
      <path d="M4.5 7l1.5 1.5 3-3" />
    </svg>
  );
}

function IconLogout() {
  return (
    <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5.5 2H3a1 1 0 00-1 1v8a1 1 0 001 1h2.5" />
      <path d="M9.5 10L12.5 7 9.5 4" />
      <path d="M12.5 7H5.5" />
    </svg>
  );
}

function IconInfo() {
  return (
    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="6" cy="6" r="4.5" />
      <path d="M6 5.5v3M6 4h.01" />
    </svg>
  );
}

// Formatea fecha legible: "5 de abril de 2026"
function formatMemberDate(creationTime: string): string {
  return new Date(creationTime).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// Iniciales de fallback si la foto no carga
function getInitial(displayName: string | null): string {
  return displayName?.charAt(0).toUpperCase() ?? "?";
}

export default function Account() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading]);

  if (loading) return <p>Cargando...</p>;
  if (!user) return null;

  const memberSince = user.metadata?.creationTime
    ? formatMemberDate(user.metadata.creationTime)
    : null;

  return (
    <main className={styles.account}>
      <div className={styles.container}>

        {/* ── Cabecera ── */}
        <div className={styles.profileHeader}>
          <div className={styles.avatarRing}>
            {user.photoURL && !imgError ? (
              <img
                src={user.photoURL}
                alt={user.displayName ?? "avatar"}
                className={styles.avatarImg}
                onError={() => setImgError(true)}
              />
            ) : (
              <div className={styles.avatarFallback}>
                {getInitial(user.displayName)}
              </div>
            )}
          </div>

          <div className={styles.profileName}>
            <span className={styles.displayName}>{user.displayName}</span>
            <span className={styles.googleBadge}>
              <img src="/logos/login.png" alt="Google" />
              Cuenta de Google
            </span>
          </div>
        </div>

        {/* ── Campos ── */}
        <div className={styles.infoCard}>
          <div className={styles.field}>
            <div className={styles.fieldLeft}>
              <div className={styles.fieldIcon}><IconName /></div>
              <span className={styles.fieldLabel}>Nombre</span>
            </div>
            <span className={styles.fieldValue}>{user.displayName}</span>
          </div>

          <div className={styles.field}>
            <div className={styles.fieldLeft}>
              <div className={styles.fieldIcon}><IconEmail /></div>
              <span className={styles.fieldLabel}>Email</span>
            </div>
            <span className={styles.fieldValue}>{user.email}</span>
          </div>

          {memberSince && (
            <div className={styles.field}>
              <div className={styles.fieldLeft}>
                <div className={styles.fieldIcon}><IconCalendar /></div>
                <span className={styles.fieldLabel}>Miembro desde</span>
              </div>
              <span className={`${styles.fieldValue} ${styles.fieldValueMono}`}>
                {memberSince}
              </span>
            </div>
          )}

          <div className={styles.field}>
            <div className={styles.fieldLeft}>
              <div className={styles.fieldIcon}><IconShield /></div>
              <span className={styles.fieldLabel}>Proveedor</span>
            </div>
            <span className={`${styles.fieldValue} ${styles.fieldValueMono}`}>
              google.com
            </span>
          </div>
        </div>

        {/* ── Footer — nota + logout ── */}
        <div className={styles.profileFooter}>
          <p className={styles.readOnlyNote}>
            <IconInfo />
            Los datos de tu cuenta los gestiona Google. Para modificarlos
            entrá a{" "}
            <a
              href="https://myaccount.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.readOnlyLink}
            >
              myaccount.google.com
            </a>
            .
          </p>
          <div className={styles.logoutRow}>
            <button className={styles.logoutBtn} onClick={logout}>
              <IconLogout />
              Cerrar sesión
            </button>
          </div>
        </div>

      </div>
    </main>
  );
}
