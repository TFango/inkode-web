# Inkode — Contexto del Proyecto para Claude

Responde siempre en español.

## ¿Qué es Inkode?

Inkode es una herramienta web para developers que permite guardar y anotar bloques de código en un **canvas infinito**, similar a Figma o n8n. La diferencia clave con otras herramientas es que las anotaciones viven en una **capa separada** del código, por lo que el código siempre se puede copiar limpio.

**Problema que resuelve:**
- Guardar código en Notion lo ensucia con las anotaciones
- GitHub Gist es lento y no tiene canvas
- No existe una herramienta que combine canvas infinito + código + capa de anotación separada

---

## Stack Técnico

| Capa | Tecnología |
|---|---|
| Frontend | Next.js 15 + TypeScript |
| Estilos | CSS Modules (NO Tailwind) |
| Canvas | tldraw |
| Editor de código | Monaco Editor (`@monaco-editor/react`) |
| Auth | Firebase Auth (Google) |
| Base de datos | Firebase Firestore |
| Deploy | Vercel (pendiente) |

**Fuentes:** Inter (UI), JetBrains Mono (código)

**Paleta de colores:**
```css
--color-bg:              #111111;
--color-surface:         #1e1e1e;
--color-border:          #2a2a2a;
--color-text:            #f0f0f0;
--color-text-secondary:  #888888;
--color-accent:          #3b82f6;
--color-accent-hover:    #2563eb;
--color-danger:          #ef4444;
--color-danger-hover:    #dc2626;
```

---

## Estructura de Carpetas

```
src/
  app/
    (app)/
      boards/
        page.tsx          ← lista de tableros del usuario
        Boards.module.css
      layout.tsx          ← Header variant="app"
    (canvas)/
      boards/
        [boardId]/
          page.tsx        ← canvas infinito (server component, pasa boardId a BoardCanvas)
    login/
      page.tsx            ← login con Google
      layout.tsx          ← Header variant="login"
      Login.module.css
    layout.tsx            ← root layout, sin header
    page.tsx              ← redirect a /login
  components/
    boards/
      BoardForm/          ← formulario crear tablero
      boardCard/          ← card individual con preview y botón eliminar
      boardList/          ← lista de cards
      BoardCanvas.tsx     ← componente cliente del canvas (hooks + tldraw)
    canvas/
      AddCodeBlockButton.tsx   ← botón agregar bloque (usa useEditor)
      CanvasPesistence.tsx     ← carga y guarda el canvas en Firestore
      CodeBlockShape.tsx       ← custom shape de tldraw con Monaco Editor
      KeyboardBlocker.tsx      ← bloquea teclado dentro de Monaco
      ModeController.tsx       ← sincroniza modo con tldraw
      ModeToggleButton.tsx     ← botón cambiar entre modos
    layout/
      header/
        Header.tsx         ← header con variante login/app
        Header.module.css
    snippets/              ← componentes legacy, no se usan en el canvas actualmente
  context/
    authContext.tsx        ← AuthProvider + useAuth hook
    modeContext.tsx        ← ModeProvider + useMode hook
  lib/
    boards.ts             ← CRUD de tableros + saveBoardCanvas + loadBoardCanvas
    firebase.ts           ← inicialización de Firebase
    snippets.ts           ← CRUD de snippets (legacy)
  types/
    board.ts              ← type Board
    snippet.ts            ← type Snippet
```

---

## Flujo Principal del Usuario

```
Usuario entra a inkode.app
  → Landing page (pendiente)
  → Login con Google → /boards
  → Ve sus tableros como cards
  → Crea un tablero nuevo
  → Entra al tablero → /boards/[boardId]
  → Canvas infinito de tldraw
  → Modo código: escribe bloques de código con Monaco
  → Modo dibujo: dibuja flechas y texto encima del código
  → Cada bloque tiene botón Copiar (copia código limpio)
  → El canvas se guarda automáticamente en Firestore
```

---

## Modelo de Datos en Firestore

```
boards (colección)
  └── boardId
        ├── name: string
        ├── userId: string
        ├── createdAt: Timestamp
        └── canvas: object  ← snapshot de tldraw (getSnapshot/loadSnapshot)
```

**Reglas de seguridad:** cada usuario solo puede leer/escribir sus propios documentos.

---

## Decisiones Técnicas Importantes

### Auth
- Solo Google por ahora via `GoogleAuthProvider` + `signInWithPopup`
- El estado global de auth vive en `AuthContext` — nunca llamar Firebase directamente desde componentes
- `useAuth()` se importa siempre desde `@/context/authContext`

### Canvas — tldraw
- `BoardCanvas.tsx` es el único componente cliente que monta `<Tldraw>`
- `page.tsx` del canvas es un **server component** que hace `await params` y pasa `boardId` como prop
- Los componentes que usan `useEditor()` deben vivir **dentro** del árbol de `<Tldraw>` via la prop `components`
- Para registrar custom shapes: `shapeUtils={[CodeBlockShapeUtil]}` fuera del componente para evitar re-renders

### Custom Shape — CodeBlockShape
- Usa `declare module "tldraw" { interface TLGlobalShapePropsMap {...} }` para registrar el tipo
- El tipo se define con `TLShape<"code-block">` (NO `TLBaseShape`)
- Las props usan validadores de tldraw: `T.number`, `T.string`
- El JSX vive en `CodeBlockContent` (componente separado) para poder usar hooks
- `onPointerDown={(e) => e.stopPropagation()}` es obligatorio para que Monaco reciba eventos

### Modos del canvas
- `ModeContext` maneja el estado global del modo (`"code"` | `"draw"`)
- `ModeController` cambia la herramienta activa de tldraw y oculta/muestra la toolbar
- `KeyboardBlocker` solo bloquea eventos de teclado cuando el foco está **dentro de Monaco** (`.monaco-editor`)
- Tecla `Q` mientras se mantiene presionada activa `pointerEvents: none` en el bloque para poder moverlo
- En modo código: toolbar de tldraw oculta via `ConditionalToolbar`
- En modo dibujo: toolbar de tldraw visible, Monaco en `readOnly: true`

### Persistencia del canvas
- Se usa `getSnapshot(editor.store)` y `loadSnapshot(editor.store, snapshot)` (funciones importadas de tldraw, NO métodos del store)
- Guardado con debounce de 1-2 segundos mientras trabaja
- Guardado al cerrar/recargar via `beforeunload`
- Guardado al navegar via `visibilitychange` (cuando la pestaña pasa a `hidden`)
- Guardado en el cleanup del `useEffect`

### CSS
- CSS Modules para todas las pantallas (NO Tailwind)
- Siempre usar variables CSS (`var(--color-accent)`) en lugar de colores hardcodeados
- `font-family` no se repite en cada clase — se hereda del `globals.css`
- Bordes redondeados máximo `border-radius: 12-16px`

---

## Patrones de Código

### Patrón de Context
```typescript
// 1. Definir tipo
type AuthContextType = { user: User | null; loading: boolean; ... }

// 2. Crear context con null default
const AuthContext = createContext<AuthContextType | null>(null)

// 3. Provider con lógica
export function AuthProvider({ children }) { ... }

// 4. Hook con guard
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth fuera de AuthProvider")
  return ctx
}
```

### Patrón de suscripción Firestore
```typescript
useEffect(() => {
  if (!user) return
  const unsubscribe = getBoards(user.uid, (data) => setBoards(data))
  return () => unsubscribe() // cleanup obligatorio
}, [user]) // [user] como dependencia, NUNCA [boards]
```

### Patrón de componente de página protegida
```typescript
const { user, loading } = useAuth()
useEffect(() => {
  if (!loading && !user) router.push("/login")
}, [user, loading])
if (loading) return <p>Cargando...</p>
if (!user) return null
```

---

## Lo que NO es Inkode

- No es un IDE ni reemplaza VS Code
- No ejecuta código
- No es para compartir código públicamente (por ahora)
- No tiene responsive/mobile (solo desktop)
- No tiene modo claro (solo dark)

---

## Pendiente

- [ ] Landing page pública
- [ ] Deploy en Vercel
- [ ] Registrar dominio (inkode.app o inkode.dev)
- [ ] Conectar formulario de Feedback con Resend (requiere dominio)
- [ ] Login con email/contraseña (baja prioridad, post-lanzamiento)
- [ ] Detección automática de lenguaje en bloques
- [ ] Modo selección múltiple para copiar varios bloques (evaluar con usuarios)
