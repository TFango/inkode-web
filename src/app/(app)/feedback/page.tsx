"use client";

import { useState } from "react";
import emailjs from "emailjs-com";
import { useAuth } from "@/context/authContext";
import styles from "./FeedBack.module.css";

const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ?? "";
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ?? "";
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? "";

type Status = "idle" | "loading" | "success" | "error";

export default function FeedBack() {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const handleSubmit = async () => {
    if (!message.trim() || status === "loading") return;

    setStatus("loading");

    try {
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          from_name: user?.displayName ?? "Usuario",
          from_email: user?.email ?? "",
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
        <div className={styles.info}>
          <h1 className={styles.title}>Feedback</h1>
          <p className={styles.description}>
            Inkode es desarrollado por una sola persona como proyecto personal
          </p>
        </div>

        <div className={styles.help}>
          <p className={styles.helpDescription}>
            Si encontraste un bug, tenés una idea de mejora o querés sugerir una
            nueva funcionalidad, escribime. Toda ayuda es bienvenida.
          </p>

          {status === "success" ? (
            <div className={styles.successBox}>
              <p className={styles.successText}>¡Gracias por tu mensaje! Te respondo a la brevedad.</p>
            </div>
          ) : (
            <form className={styles.form} onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Mensaje</label>
                <textarea
                  placeholder="Contame qué encontraste o qué te gustaría ver en Inkode"
                  className={styles.textarea}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={status === "loading"}
                />
              </div>

              {status === "error" && (
                <p className={styles.errorText}>
                  Hubo un error al enviar. Intentá de nuevo.
                </p>
              )}

              <button
                type="submit"
                className={styles.btn}
                disabled={!message.trim() || status === "loading"}
              >
                {status === "loading" ? "Enviando..." : "Enviar mensaje"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}