# Compartir Tableros — Spec de Diseño
**Fecha:** 2026-04-12
**Estado:** Aprobado

---

## Resumen

Permitir que un tablero se pueda hacer público y compartir con un link. Cualquier persona (sin cuenta) puede abrir el link y ver el canvas en modo solo lectura con pan/zoom. El objetivo es que Inkode deje de ser una herramienta estrictamente individual y empiece a circular entre usuarios.

---

## Decisiones de diseño

| Pregunta | Decisión |
|---|---|
| ¿Requiere cuenta para ver? | No — acceso completamente público |
| ¿Qué puede hacer el visitante? | Pan y zoom — sin copiar código (futuro) |
| ¿Dónde comparte el dueño? | En la card del tablero Y dentro del canvas |
| ¿URL del visitante? | Ruta separada `/shared/[boardId]` |
| ¿Badge de Inkode? | Sí — discreto, con link a `/login` |
| ¿Se puede volver a hacer privado? | No por ahora, pero el campo es un boolean para que sea trivial en el futuro |

---

## Modelo de datos

### Campo nuevo en `boards` (Firestore)

```ts
isPublic?: boolean  // ausente o false = privado, true = público
```

Se agrega con `setDoc(..., { isPublic: true }, { merge: true })`. No se setea al crear el tablero — ausente equivale a `false`.

### Type `Board` actualizado

```ts
export type Board = {
  id: string;
  name: string;
  userId: string;
  createdAt: Timestamp;
  isPublic?: boolean;   // nuevo, opcional
}
```

### Función nueva en `lib/boards.ts`

```ts
export async function setBoardPublic(boardId: string): Promise<void>
```

Hace `setDoc` con `{ isPublic: true }` y `merge: true`. Preparada para recibir un booleano en el futuro cuando se implemente el toggle.

### Reglas de seguridad Firestore

```
match /boards/{boardId} {
  allow read: if (request.auth != null && resource.data.userId == request.auth.uid)
               || resource.data.isPublic == true;
  allow write: if request.auth != null && resource.data.userId == request.auth.uid;
}
```

La lectura es pública si `isPublic === true`. La escritura sigue siendo exclusiva del dueño.

---

## Arquitectura — archivos nuevos

```
src/
  app/
    (shared)/
      shared/
        [boardId]/
          page.tsx          ← server component, verifica isPublic, notFound si no
  components/
    canvas/
      SharedCanvas.tsx      ← cliente, tldraw readOnly, sin persistencia
      SharedBadge.tsx       ← badge "Hecho con Inkode" → /login
      SharedCanvas.module.css
```

### `(shared)` layout

La ruta `(shared)` tiene su propio layout **sin header**. El visitante ve solo el canvas y el badge.

---

## Componentes

### `page.tsx` — `/shared/[boardId]`

Server component. Hace `getDoc` del tablero:
- No existe → `notFound()`
- Existe pero `isPublic !== true` → `notFound()` (no revelar que existe)
- Existe y es público → renderiza `<SharedCanvas boardId={boardId} name={name} />`

### `SharedCanvas.tsx`

Componente cliente. Responsabilidades:
- Llama a `loadBoardCanvas(boardId)` una sola vez al montar (sin localStorage)
- Monta `<Tldraw readOnly shapeUtils={[CodeBlockShapeUtil]} />` con toda la UI oculta (`Toolbar: null`, `PageMenu: null`, `HelperButtons: null`)
- Muestra `<SharedBadge />` sobre el canvas
- Si falla la carga, muestra mensaje de error simple

Sin `ModeProvider`, sin `CanvasPersistence`, sin `OnboardingTooltip`, sin `KeyboardBlocker`.

### `SharedBadge.tsx`

Posicionado `position: fixed`, abajo a la derecha. Texto "Hecho con Inkode" con link a `/login`. Estilo: fondo `--color-surface`, borde `--color-border`, texto `--color-text-secondary`. Discreto pero visible. Sirve como vector de crecimiento orgánico.

---

## Botón de compartir (dueño)

### En `BoardCard`

- Ícono SVG de compartir en el footer, al lado del ícono de eliminar
- Si `board.isPublic !== true`: llama a `setBoardPublic(board.id)` → copia link → feedback "¡Link copiado!" 2s
- Si `board.isPublic === true`: ícono en color `--color-accent` (indica que ya es público) → solo copia el link, no escribe en Firestore
- Estado local para el feedback visual (igual al patrón de `confirming` existente)

### En `BoardCanvas`

- Botón "Compartir" en la barra flotante inferior, al lado de `ModeToggleButton` y `AddCodeBlockButton`
- Recibe prop `isPublic?: boolean` que el server component (`page.tsx`) le pasa tras leer Firestore
- Mismo comportamiento que en la card: llama `setBoardPublic` si no es público, copia link, muestra feedback

---

## Flujo completo

### Dueño comparte

```
Click "Compartir" (card o canvas)
  → si !isPublic: setBoardPublic(boardId) en Firestore
  → navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_APP_URL}/shared/${boardId}`)
  // NEXT_PUBLIC_APP_URL = "https://inkode-web.vercel.app" en producción, "http://localhost:3000" en desarrollo
  → feedback visual "¡Link copiado!" por 2s
```

### Visitante abre el link

```
GET /shared/[boardId]
  → server: getDoc del tablero
  → si no existe o !isPublic: 404
  → si isPublic: renderiza SharedCanvas
    → SharedCanvas: loadBoardCanvas(boardId) desde Firestore
    → tldraw readOnly con el snapshot
    → visitante puede hacer pan/zoom
    → badge "Hecho con Inkode" visible
```

---

## Lo que el visitante NO ve

- Header de Inkode
- Toolbar de tldraw
- Botón agregar bloque
- Toggle de modo código/dibujo
- Onboarding tooltip

---

## Fuera de scope (posibles features futuras)

- Toggle para volver a hacer privado un tablero (el campo `isPublic: boolean` ya lo soporta)
- Botón de copiar código en modo lectura
- Preview del tablero en la card cuando es público
- Open Graph / meta tags para preview en redes sociales
