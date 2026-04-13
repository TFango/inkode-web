"use client";

import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import styles from "./Login.module.css";

// SVG icons inline — sin dependencias extra
function IconLayers() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M8 1.5L14 5l-6 3.5L2 5z" />
      <path d="M2 8.5l6 3.5 6-3.5" />
      <path d="M2 11.5l6 3.5 6-3.5" />
    </svg>
  );
}

function IconCode() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M5 4L1.5 8 5 12" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11 4l3.5 4-3.5 4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconCopy() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="5.5" y="5.5" width="8" height="9" rx="1.5" />
      <path d="M3 10.5H2.5A1.5 1.5 0 011 9V2.5A1.5 1.5 0 012.5 1H9A1.5 1.5 0 0110.5 2.5V3" />
    </svg>
  );
}

// Fragmentos de código decorativos para el fondo
const CODE_SNIPPETS = [
  `function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1)
       + fibonacci(n - 2);
}`,
  `const useDebounce = (fn, ms) => {
  const timer = useRef(null);
  return (...args) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(
      () => fn(...args), ms
    );
  };
};`,
  `// Firestore snapshot
const snap = getSnapshot(
  editor.store
);
await saveCanvas(boardId, snap);`,
  `type CodeBlock = {
  id: string;
  code: string;
  language: string;
  x: number;
  y: number;
};`,
  `// canvas debounce — 500ms
editor.store.listen(
  debounce(save, 500)
);`,
];

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
      {/* Canvas decoration — bloques de código flotando */}
      <div className={styles.canvasBg} aria-hidden="true">
        {CODE_SNIPPETS.map((snippet, i) => (
          <div key={i} className={styles.codeBlock}>
            {snippet}
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className={styles.footer}>
        <span>Creado por Emanuel Bustos</span>
        <div className={styles.footerSep} />
        <div className={styles.footerLinks}>
          <a
            href="https://www.linkedin.com/in/facundo-emanuel-jimenez-bustos-49207136b/?skipRedirect=true"
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

      {/* Contenido principal */}
      <div className={styles.container}>
        {/* Izquierda — copy + CTA */}
        <div className={styles.info}>
          {/* Badge */}
          <div className={styles.badge}>
            <div className={styles.badgeDot} />
            herramienta para developers
          </div>

          {/* Título */}
          <h1 className={styles.title}>
            Tu código,
            <span className={styles.titleAccent}>organizado</span>
            <br />
            en un canvas infinito
          </h1>

          {/* Subtitle */}
          <p className={styles.subtitle}>
            Guardá snippets en tableros visuales. Anotá encima sin ensuciar el código.
            Copiá limpio siempre.
          </p>

          {/* Features */}
          <div className={styles.features}>
            <div className={styles.feature}>
              <span className={styles.featureIcon}><IconLayers /></span>
              Anotaciones en capa separada, el código queda limpio
            </div>
            <div className={styles.feature}>
              <span className={styles.featureIcon}><IconCode /></span>
              Monaco Editor con detección automática de lenguaje
            </div>
            <div className={styles.feature}>
              <span className={styles.featureIcon}><IconCopy /></span>
              Canvas infinito tipo Figma, pensado para código
            </div>
          </div>

          {/* CTA */}
          <button onClick={loginWithGoogle} className={styles.btn}>
            <img className={styles.logo} src="/logos/login.png" alt="Google" />
            Empezar gratis con Google
          </button>
        </div>

        {/* Derecha — video con marco tipo tablero */}
        <div className={styles.play}>
          <div className={styles.videoFrame}>
            <div className={styles.videoInner}>
              {/* Barra de título decorativa */}
              <div className={styles.videoBar}>
                <div className={styles.videoBarDot} />
                <div className={styles.videoBarDot} />
                <div className={styles.videoBarDot} />
                <span className={styles.videoBarTitle}>Mi primer tablero</span>
              </div>
              <video
                className={styles.video}
                src="https://res.cloudinary.com/dmdi9t777/video/upload/q_auto/f_auto/v1775146630/Video_Project_1_rwhgro.mp4"
                autoPlay
                loop
                muted
                playsInline
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
