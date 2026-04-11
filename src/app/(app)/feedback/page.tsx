"use client";

import { useState } from "react";
import emailjs from "emailjs-com";
import { useAuth } from "@/context/authContext";
import styles from "./FeedBack.module.css";

const SERVICE_ID  = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID  ?? "";
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ?? "";
const PUBLIC_KEY  = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY  ?? "";

type Status   = "idle" | "loading" | "success" | "error";
type Category = "bug" | "idea" | "pregunta" | "otro";

const CATEGORIES: { id: Category; label: string; placeholder: string }[] = [
  { id: "bug",      label: "Bug",      placeholder: "Describí qué pasó y cómo reproducirlo. Cualquier detalle ayuda." },
  { id: "idea",     label: "Idea",     placeholder: "¿Qué feature te gustaría ver? Contame el caso de uso." },
  { id: "pregunta", label: "Pregunta", placeholder: "¿Qué no te queda claro? Con gusto te respondo." },
  { id: "otro",     label: "Otro",     placeholder: "Contame qué encontraste o qué te gustaría ver en Inkode." },
];

const DEFAULT_PLACEHOLDER = "Contame qué encontraste o qué te gustaría ver en Inkode.";

function IconBug() {
  return (
    <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="7" cy="8" r="3.5" />
      <path d="M5 4.5c0-1.1.9-2 2-2s2 .9 2 2" />
      <path d="M2 7h2M10 7h2M3 4.5l1.5 2M11 4.5L9.5 6.5M3 11l1.5-1.5M11 11L9.5 9.5" />
    </svg>
  );
}

function IconIdea() {
  return (
    <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 1.5a4 4 0 013 6.6V10H4V8.1A4 4 0 017 1.5z" />
      <path d="M5 10v.5a2 2 0 004 0V10" />
    </svg>
  );
}

function IconQuestion() {
  return (
    <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="7" cy="7" r="5.5" />
      <path d="M5.5 5.5a1.5 1.5 0 112.8.75C8 7 7 7.5 7 8.5" />
      <circle cx="7" cy="10.5" r=".5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconOther() {
  return (
    <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="3.5" cy="7" r=".75" fill="currentColor" stroke="none" />
      <circle cx="7"   cy="7" r=".75" fill="currentColor" stroke="none" />
      <circle cx="10.5" cy="7" r=".75" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconSend() {
  return (
    <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12.5 1.5L6.5 7.5M12.5 1.5L8.5 12.5 6.5 7.5 1.5 5.5l11-4z" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 10.5l4 4 8-8" />
    </svg>
  );
}

const ICON_MAP: Record<Category, React.ReactNode> = {
  bug:      <IconBug />,
  idea:     <IconIdea />,
  pregunta: <IconQuestion />,
  otro:     <IconOther />,
};

const REASON_COLOR: Record<Category, string> = {
  bug:      "rgba(239, 68, 68, 0.6)",
  idea:     "rgba(249, 115, 22, 0.65)",
  pregunta: "rgba(59, 130, 246, 0.65)",
  otro:     "rgba(136, 136, 136, 0.55)",
};

export default function FeedBack() {
  const { user } = useAuth();
  const [message,  setMessage]  = useState("");
  const [status,   setStatus]   = useState<Status>("idle");
  const [category, setCategory] = useState<Category | null>(null);

  const placeholder = category
    ? CATEGORIES.find((c) => c.id === category)?.placeholder ?? DEFAULT_PLACEHOLDER
    : DEFAULT_PLACEHOLDER;

  const handleSubmit = async () => {
    if (!message.trim() || status === "loading") return;

    setStatus("loading");

    try {
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          from_name:  user?.displayName ?? "Usuario",
          from_email: user?.email ?? "",
          category:   category ?? "general",
          message,
        },
        PUBLIC_KEY
      );
      setStatus("success");
      setMessage("");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className={styles.feedback}>
      <div className={styles.container}>

        {/* ── Columna izquierda — contexto ── */}
        <div className={styles.info}>
          <div className={styles.infoHeader}>
            <h1 className={styles.title}>Tu opinión<br />hace la diferencia</h1>
            <p className={styles.description}>
              Inkode lo desarrolla una sola persona. Cada mensaje que llega
              va directo a quien toma las decisiones del producto.
            </p>
          </div>

          <div className={styles.reasons}>
            {CATEGORIES.slice(0, 3).map((cat) => (
              <div className={styles.reason} key={cat.id}>
                <div
                  className={styles.reasonIcon}
                  style={{ color: REASON_COLOR[cat.id] }}
                >
                  {ICON_MAP[cat.id]}
                </div>
                <div className={styles.reasonText}>
                  <span className={styles.reasonLabel}>
                    {cat.id === "bug"      && "Encontraste un bug"}
                    {cat.id === "idea"     && "Tenés una idea"}
                    {cat.id === "pregunta" && "Tenés una pregunta"}
                  </span>
                  <span className={styles.reasonSub}>
                    {cat.id === "bug"      && "Reportarlo ayuda a mejorar la experiencia para todos."}
                    {cat.id === "idea"     && "El roadmap se construye con lo que los usuarios piden."}
                    {cat.id === "pregunta" && "Si algo no está claro, probablemente no lo está para otros."}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Bloque de código decorativo */}
          <div className={styles.codeSnippet}>
            <span className={styles.codeComment}>{"// feedback recibido"}</span>
            <span>
              <span className={styles.codeKeyword}>const </span>
              <span className={styles.codeNeutral}>msg </span>
              <span className={styles.codeNeutral}>= </span>
              <span className={styles.codeString}>"tu mensaje"</span>
              <span className={styles.codeNeutral}>;</span>
            </span>
            <span>
              <span className={styles.codeFn}>sendTo</span>
              <span className={styles.codeNeutral}>(</span>
              <span className={styles.codeString}>"emanuel"</span>
              <span className={styles.codeNeutral}>, msg);</span>
            </span>
            <span className={styles.codeComment}>{"// → se lee, se considera, se actúa"}</span>
          </div>
        </div>

        {/* ── Columna derecha — form / success ── */}
        <div className={styles.formCol}>
          {status === "success" ? (
            <div className={styles.successBox}>
              <div className={styles.successIcon}>
                <IconCheck />
              </div>
              <p className={styles.successTitle}>¡Mensaje recibido!</p>
              <p className={styles.successText}>
                Gracias por tomarte el tiempo. Lo leo personalmente y te respondo a la brevedad.
              </p>
            </div>
          ) : (
            <form
              className={styles.form}
              onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}
            >
              {/* Categorías */}
              <div className={styles.categoryGroup}>
                <span className={styles.categoryLabel}>Tipo</span>
                <div className={styles.categories}>
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      className={`${styles.categoryPill} ${category === cat.id ? styles.categoryPillActive : ""}`}
                      onClick={() => setCategory(category === cat.id ? null : cat.id)}
                    >
                      <span className={styles.pillDot} />
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Textarea */}
              <div className={styles.textareaGroup}>
                <span className={styles.textareaLabel}>Mensaje</span>
                <textarea
                  className={styles.textarea}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={placeholder}
                  disabled={status === "loading"}
                />
              </div>

              {status === "error" && (
                <p className={styles.errorText}>
                  // error al enviar — intentá de nuevo
                </p>
              )}

              {/* Footer */}
              <div className={styles.formFooter}>
                <span className={`${styles.charCount} ${message.length > 0 ? styles.charCountActive : ""}`}>
                  {message.length} caracteres
                </span>
                <button
                  type="submit"
                  className={styles.btn}
                  disabled={!message.trim() || status === "loading"}
                >
                  <IconSend />
                  {status === "loading" ? "Enviando..." : "Enviar"}
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </section>
  );
}
