import { actualizaciones } from "@/data/actualizaciones";
import styles from "./Actualizaciones.module.css";

export default function Actualizaciones() {
  return (
    <main className={styles.hero}>
      <h1 className={styles.title}>Actualizaciones</h1>

      <div className={styles.list}>
        {actualizaciones.map((version) => (
          <section key={version.version} className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.version}>{version.version}</h2>
              <p className={styles.cardTitle}>{version.title}</p>
              <p className={styles.date}>{version.date}</p>
            </div>
            <ul className={styles.changes}>
              {version.changes.map((change, index) => (
                <li key={index}>{change}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
