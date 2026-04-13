import Link from "next/link";
import styles from "./SharedCanvas.module.css";

export default function SharedBadge() {
  return (
    <div className={styles.badge}>
      <Link href="/login">Hecho con Inkode</Link>
    </div>
  );
}
