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
      <div className={styles.container}>
        <div className={styles.info}>
          <h1 className={styles.title}>
            Guardá y anotá tu código, <br /> sin el desorden.
          </h1>
          <p className={styles.subtitle}>Probá Inkode de forma gratuita</p>
        </div>

        <div className={styles.util}>
          <div className={styles.login}>
            <h2 className={styles.loginTitle}>Iniciar Sesión</h2>
            <button onClick={loginWithGoogle} className={styles.btn}>
              <img className={styles.logo} src="/logos/login.png" alt="Google" />
              Entrar con google
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
      </div>
    </main>
  );
}
