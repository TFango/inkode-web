"use client";

import styles from "./FeedBack.module.css";

export default function FeedBack() {
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

          <form className={styles.form}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Nombre</label>
              <input
                type="text"
                placeholder="Tu nombre"
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Mensaje</label>
              <textarea
                placeholder="Contame qué encontraste o qué te gustaría ver en Inkode"
                className={styles.textarea}
              />
            </div>

            <button type="submit" className={styles.btn}>
              Enviar mensaje
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
