"use client";

import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import styles from "./Login.module.css";

export default function LoginPage() {
  const { user, loading, loginWithGoogle } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/boards");
    }
  }, [user, loading]);

  return (
    <main className={styles.main}>
      <footer className={styles.footer}>
        <span>Creado por Emanuel Bustos</span>
        <div className={styles.footerLinks}>
          <a
            href="www.linkedin.com/in/facundo-emanuel-jimenez-bustos-49207136b"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.footerLink}
          >
            LinkedIn
          </a>
          <a
            href="https://github.com/TFango/inkode-web"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.footerLink}
          >
            GitHub
          </a>
        </div>
      </footer>
      <div className={styles.container}>
        <div className={styles.info}>
          <h1 className={styles.title}>
            Guardá, organizá y visualizá <br />
            tu código en un solo lugar
          </h1>

          <p className={styles.subtitle}>
            Dejá de perder tiempo buscando snippets. Tené todo organizado y
            accesible.
          </p>

          <ul className={styles.list}>
            <li>Organizá código en tableros</li>
            <li>Visualizá relaciones en canvas</li>
            <li>Accedé rápido a todo</li>
          </ul>

          <button onClick={loginWithGoogle} className={styles.btn}>
            <img className={styles.logo} src="/logos/login.png" alt="Google" />
            Empezar gratis con Google
          </button>
        </div>

        <div className={styles.play}>
          <video
            className={styles.video}
            src="https://res.cloudinary.com/dmdi9t777/video/upload/v1774819814/loginVideo_fppyqn.mp4"
            autoPlay
            loop
            muted
            playsInline
          />
        </div>
      </div>
    </main>
  );
}
