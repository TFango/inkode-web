import { actualizaciones } from "@/data/actualizaciones";
import styles from "./Actualizaciones.module.css";

// Formatea "2026-04-09" → "9 abr 2026"
function formatDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  const months = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];
  return `${day} ${months[month - 1]} ${year}`;
}

function IconCheck() {
  return (
    <svg
      className={styles.changeIcon}
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 6.5l2.5 2.5 5.5-5.5" />
    </svg>
  );
}

export default function Actualizaciones() {
  const latest = actualizaciones[0];

  return (
    <main className={styles.hero}>
      {/* Encabezado */}
      <div className={styles.pageHeader}>
        <h1 className={styles.title}>Novedades</h1>
        <div className={styles.titleMeta}>
          {latest && (
            <span className={styles.currentVersion}>v{latest.version}</span>
          )}
          <div className={styles.titleSep} aria-hidden="true" />
          <span className={styles.entryCount}>
            {actualizaciones.length === 1
              ? "1 versión"
              : `${actualizaciones.length} versiones`}
          </span>
        </div>
      </div>

      {/* Timeline */}
      <div className={styles.timeline}>
        {actualizaciones.map((version, index) => (
          <div key={version.version} className={styles.entry}>
            {/* Izquierda — metadata */}
            <div className={styles.meta}>
              <span className={styles.versionTag}>v{version.version}</span>
              <span className={styles.dateTag}>{formatDate(version.date)}</span>
              {index === 0 && (
                <span className={styles.latestBadge}>latest</span>
              )}
            </div>

            {/* Derecha — contenido */}
            <div className={styles.content}>
              <h2 className={styles.entryTitle}>{version.title}</h2>
              <ul className={styles.changes}>
                {version.changes.map((change, i) => (
                  <li key={i}>
                    <IconCheck />
                    {change}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
