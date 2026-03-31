"use client";

import { useAuth } from "@/context/authContext";
import styles from "./Account.module.css";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Account() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading]);

  if (loading) return <p>Cargando...</p>;
  if (!user) return null;

  const memberSince = user.metadata?.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString("es-AR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <main className={styles.account}>
      <div className={styles.container}>
        <h1 className={styles.title}>Información personal</h1>

        <div className={styles.info}>
          <div className={styles.group}>
            <div className={styles.groupInfo}>
              <img src="/logos/name.svg" alt="" className={styles.icon} />
              <p className={styles.label}>Nombre</p>
            </div>
            <p className={styles.value}>{user.displayName}</p>
          </div>

          <div className={styles.divider} />

          <div className={styles.group}>
            <div className={styles.groupInfo}>
              <img src="/logos/email.svg" alt="" className={styles.icon} />
              <p className={styles.label}>Email</p>
            </div>
            <p className={styles.value}>{user.email}</p>
          </div>

          {memberSince && (
            <>
              <div className={styles.divider} />
              <div className={styles.group}>
                <div className={styles.groupInfo}>
                  <img src="/logos/calendar.svg" alt="" className={styles.icon} />
                  <p className={styles.label}>Miembro desde</p>
                </div>
                <p className={styles.value}>{memberSince}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}