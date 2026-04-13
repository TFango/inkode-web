# Compartir Tableros — Plan de Implementación
**Fecha:** 2026-04-12
**Spec:** [2026-04-12-compartir-tableros-design.md](./2026-04-12-compartir-tableros-design.md)

---

## Orden de implementación

Las tareas están ordenadas para que cada paso sea testeable de forma aislada antes de pasar al siguiente.

---

### Paso 1 — Modelo de datos y función en lib

**Archivos a modificar:**
- `src/types/board.ts` — agregar `isPublic?: boolean`
- `src/lib/boards.ts` — agregar función `setBoardPublic(boardId: string): Promise<void>`

**Detalle:**

```ts
// board.ts
export type Board = {
  id: string;
  name: string;
  userId: string;
  createdAt: Timestamp;
  isPublic?: boolean;  // nuevo
}
```

```ts
// boards.ts — agregar al final
export async function setBoardPublic(boardId: string): Promise<void> {
  const ref = doc(db, "boards", boardId);
  await setDoc(ref, { isPublic: true }, { merge: true });
}
```

**Verificación:** TypeScript compila sin errores.

---

### Paso 2 — Reglas de seguridad Firestore

**Archivo:** consola de Firebase (Firestore Rules) — NO es un archivo del repo.

Actualizar las reglas de la colección `boards`:

```
match /boards/{boardId} {
  allow read: if (request.auth != null && resource.data.userId == request.auth.uid)
               || resource.data.isPublic == true;
  allow write: if request.auth != null && resource.data.userId == request.auth.uid;
}
```

**Verificación:** desde una sesión anónima (incógnito), hacer `getDoc` de un tablero con `isPublic: true` debe funcionar. Uno sin ese campo debe fallar.

---

### Paso 3 — Variable de entorno

**Archivos a modificar:**
- `.env.local` — agregar `NEXT_PUBLIC_APP_URL=http://localhost:3000`
- Vercel dashboard — agregar `NEXT_PUBLIC_APP_URL=https://inkode-web.vercel.app`

**Verificación:** `process.env.NEXT_PUBLIC_APP_URL` disponible en cliente.

---

### Paso 4 — Ruta y layout (shared)

**Archivos a crear:**
- `src/app/(shared)/layout.tsx` — layout sin header, solo `{children}`
- `src/app/(shared)/shared/[boardId]/page.tsx` — server component

```tsx
// layout.tsx
export default function SharedLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
```

```tsx
// page.tsx
import { notFound } from "next/navigation";
import { getDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import SharedCanvas from "@/components/canvas/SharedCanvas";

type Params = { params: Promise<{ boardId: string }> };

export default async function SharedBoardPage({ params }: Params) {
  const { boardId } = await params;
  const snap = await getDoc(doc(db, "boards", boardId));

  if (!snap.exists() || snap.data()?.isPublic !== true) {
    notFound();
  }

  const name = snap.data()?.name ?? "Tablero";
  return <SharedCanvas boardId={boardId} name={name} />;
}
```

**Verificación:** `/shared/[id-inexistente]` devuelve 404. `/shared/[id-privado]` devuelve 404.

---

### Paso 5 — SharedBadge

**Archivo a crear:** `src/components/canvas/SharedBadge.tsx`

Badge `position: fixed`, abajo a la derecha. Link a `/login`. Estilo con variables CSS de la paleta.

```tsx
import Link from "next/link";
import styles from "./SharedCanvas.module.css";

export default function SharedBadge() {
  return (
    <div className={styles.badge}>
      <Link href="/login">Hecho con Inkode</Link>
    </div>
  );
}
```

CSS en `SharedCanvas.module.css`:
```css
.badge {
  position: fixed;
  bottom: 16px;
  right: 16px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 6px 12px;
  font-size: 12px;
  color: var(--color-text-secondary);
  z-index: 9999;
}

.badge a {
  color: inherit;
  text-decoration: none;
}

.badge a:hover {
  color: var(--color-text);
}
```

---

### Paso 6 — SharedCanvas

**Archivo a crear:** `src/components/canvas/SharedCanvas.tsx`

```tsx
"use client";

import { Tldraw, loadSnapshot } from "tldraw";
import "tldraw/tldraw.css";
import { useEffect, useState } from "react";
import { CodeBlockShapeUtil } from "./CodeBlockShape";
import { loadBoardCanvas } from "@/lib/boards";
import SharedBadge from "./SharedBadge";
import styles from "./SharedCanvas.module.css";

const shapeUtils = [CodeBlockShapeUtil];

export default function SharedCanvas({ boardId, name }: { boardId: string; name: string }) {
  const [snapshot, setSnapshot] = useState<unknown>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    loadBoardCanvas(boardId)
      .then((data) => setSnapshot(data?.snapshot ?? null))
      .catch(() => setError(true));
  }, [boardId]);

  if (error) return <p>No se pudo cargar el tablero.</p>;

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Tldraw
        licenseKey={process.env.NEXT_PUBLIC_TLDRAW_LICENSE_KEY}
        shapeUtils={shapeUtils}
        inferDarkMode
        readOnly
        snapshot={snapshot as any}
        components={{
          PageMenu: null,
          Toolbar: null,
          HelperButtons: null,
          NavigationPanel: null,
        }}
      />
      <SharedBadge />
    </div>
  );
}
```

**Nota sobre snapshot:** tldraw acepta `snapshot` como prop directamente en v4, lo que evita necesitar el editor para llamar `loadSnapshot`. Verificar en la doc de tldraw v4 si esta prop existe; si no, usar el patrón `onMount` con `loadSnapshot(editor.store, snapshot)`.

**Verificación:** `/shared/[id-publico]` muestra el canvas con los bloques, sin toolbar, con el badge.

---

### Paso 7 — Botón compartir en BoardCard

**Archivos a modificar:**
- `src/components/boards/boardCard/BoardCard.tsx`
- `src/components/boards/boardCard/BoardCard.module.css`

**Cambios en BoardCard.tsx:**
- Importar `setBoardPublic` de `@/lib/boards`
- Estado local `copied` (boolean, 2s) para el feedback
- Ícono SVG de compartir (similar en estilo al de eliminar)
- Si `board.isPublic`: ícono en `--color-accent`, click solo copia
- Si `!board.isPublic`: click llama `setBoardPublic` luego copia

```tsx
const handleShare = async (e: React.MouseEvent) => {
  e.stopPropagation();
  if (!board.isPublic) await setBoardPublic(board.id);
  const url = `${process.env.NEXT_PUBLIC_APP_URL}/shared/${board.id}`;
  await navigator.clipboard.writeText(url);
  setCopied(true);
  setTimeout(() => setCopied(false), 2000);
};
```

**Verificación:** click en compartir en un tablero privado → lo hace público en Firestore → copia link → feedback 2s. Click en tablero ya público → solo copia link.

---

### Paso 8 — Botón compartir en BoardCanvas

**Archivos a modificar:**
- `src/app/(canvas)/boards/[boardId]/page.tsx` — leer `isPublic` de Firestore y pasarlo como prop
- `src/components/canvas/BoardCanvas.tsx` — recibir prop `isPublic`, agregar botón en barra flotante

**En page.tsx:**
```tsx
import { getDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default async function BoardPage({ params }: Params) {
  const { boardId } = await params;
  const snap = await getDoc(doc(db, "boards", boardId));
  const isPublic = snap.data()?.isPublic === true;
  return <BoardCanvas boardId={boardId} isPublic={isPublic} />;
}
```

**En BoardCanvas.tsx:**
- Agregar prop `isPublic?: boolean`
- Estado `copied` para feedback
- Botón "Compartir" en la barra flotante, mismo estilo que los botones existentes
- Separador visual antes del botón (igual al separador existente)

**Verificación:** botón visible en el canvas, funciona igual que en la card.

---

## Resumen de archivos

| Archivo | Acción |
|---|---|
| `src/types/board.ts` | Modificar — agregar `isPublic?` |
| `src/lib/boards.ts` | Modificar — agregar `setBoardPublic` |
| `src/app/(shared)/layout.tsx` | Crear |
| `src/app/(shared)/shared/[boardId]/page.tsx` | Crear |
| `src/components/canvas/SharedCanvas.tsx` | Crear |
| `src/components/canvas/SharedCanvas.module.css` | Crear |
| `src/components/canvas/SharedBadge.tsx` | Crear |
| `src/components/boards/boardCard/BoardCard.tsx` | Modificar |
| `src/components/boards/boardCard/BoardCard.module.css` | Modificar |
| `src/app/(canvas)/boards/[boardId]/page.tsx` | Modificar |
| `src/components/canvas/BoardCanvas.tsx` | Modificar |
| `.env.local` | Modificar — agregar `NEXT_PUBLIC_APP_URL` |
| Firestore Rules (consola) | Actualizar manualmente |
| Vercel dashboard | Agregar `NEXT_PUBLIC_APP_URL` |

---

## Notas de riesgo

- **Reglas de Firestore:** el cambio es en producción. Verificar bien antes de publicar que la regla de escritura no se relaja.
- **tldraw prop `snapshot`:** confirmar que tldraw v4 acepta `snapshot` como prop directa antes de implementar `SharedCanvas`. Si no existe, usar `onMount` callback.
- **Firebase en server component:** `getDoc` desde el server component de Next.js usa el SDK de cliente (`firebase/firestore`). Esto funciona en Next.js 16 con App Router pero requiere que Firebase esté inicializado. Verificar que `lib/firebase.ts` funcione en contexto de server component o usar el Admin SDK si falla.
