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
| Frontend | Next.js 16 + TypeScript |
| Estilos | CSS Modules (NO Tailwind) |
| Canvas | tldraw v4 (licencia trial 100 días) |
| Editor de código | Monaco Editor (`@monaco-editor/react`) |
| Detección de lenguaje | highlight.js (core, lenguajes populares) |
| Auth | Firebase Auth (Google) |
| Base de datos | Firebase Firestore |
| Deploy | Vercel — https://inkode-web.vercel.app |

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
      account/
        page.tsx          ← perfil del usuario
      feedback/
        page.tsx          ← formulario de feedback
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
      BoardForm/          ← formulario crear tablero (llama onCreated al terminar)
      boardCard/          ← card individual con preview y botón eliminar
      boardList/          ← lista de cards (recibe boards/ready/onDeleted como props)
      BoardCanvas.tsx     ← componente cliente del canvas (hooks + tldraw)
    canvas/
      AddCodeBlockButton.tsx   ← botón agregar bloque (usa useEditor)
      CanvasPesistence.tsx     ← carga y guarda el canvas
      CodeBlockShape.tsx       ← custom shape de tldraw con Monaco Editor
      KeyboardBlocker.tsx      ← bloquea teclado dentro de Monaco
      ModeController.tsx       ← sincroniza modo con tldraw
      ModeToggleButton.tsx     ← botón cambiar entre modos
    layout/
      header/
        Header.tsx         ← header con variante login/app
        Header.module.css
  context/
    authContext.tsx        ← AuthProvider + useAuth hook
    modeContext.tsx        ← ModeProvider + useMode hook
  lib/
    boards.ts             ← CRUD de tableros + saveBoardCanvas + loadBoardCanvas
    firebase.ts           ← inicialización de Firebase
  types/
    board.ts              ← type Board
```

---

## Flujo Principal del Usuario

```
Usuario entra a inkode-web.vercel.app
  → Login con Google → /boards
  → Si es nuevo usuario: se crea "Mi primer tablero" automáticamente
  → Ve sus tableros como cards
  → Crea un tablero nuevo
  → Entra al tablero → /boards/[boardId]
  → Canvas infinito de tldraw
  → Modo código: escribe bloques de código con Monaco
  → Modo dibujo: dibuja flechas y texto encima del código
  → Cada bloque tiene botón Copiar (copia código limpio)
  → El canvas se guarda en localStorage cada 500ms y en Firestore al salir
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
- Solo Google via `GoogleAuthProvider` + `signInWithPopup`
- El error `auth/popup-closed-by-user` se ignora silenciosamente (es acción válida del usuario)
- Si el usuario es nuevo (`getAdditionalUserInfo(result)?.isNewUser`), se crea un tablero default automáticamente
- El estado global de auth vive en `AuthContext` — nunca llamar Firebase directamente desde componentes
- `useAuth()` se importa siempre desde `@/context/authContext`

### Canvas — tldraw
- `BoardCanvas.tsx` es el único componente cliente que monta `<Tldraw>`
- `page.tsx` del canvas es un **server component** que hace `await params` y pasa `boardId` como prop
- Los componentes que usan `useEditor()` deben vivir **dentro** del árbol de `<Tldraw>` via la prop `components`
- Para registrar custom shapes: `shapeUtils={[CodeBlockShapeUtil]}` fuera del componente para evitar re-renders
- `PageMenu: null` en components para deshabilitar la creación de múltiples páginas
- La licencia de tldraw se pasa via `licenseKey={process.env.NEXT_PUBLIC_TLDRAW_LICENSE_KEY}`

### Custom Shape — CodeBlockShape
- Props: `w`, `h`, `code`, `language`, `userResized` (boolean)
- `userResized: true` desactiva el auto-resize cuando el usuario estira el bloque manualmente
- `onResize` actualiza `w`, `h` y setea `userResized: true`
- `canBind()` retorna `false` para evitar el efecto punteado cuando las flechas pasan por encima
- El lenguaje se detecta automáticamente con `hljs.highlightAuto()` — mínimo 20 chars y relevance ≥ 5
- Auto-resize: alto por cantidad de líneas (`LINE_HEIGHT = 19`), ancho por línea más larga (`CHAR_WIDTH = 7.8`)
- `onKeyDown/onKeyUp` en el div raíz para intentar bloquear shortcuts de tldraw (limitado)

### Modos del canvas
- `ModeContext` maneja el estado global del modo (`"code"` | `"draw"`)
- `ModeController` cambia la herramienta activa de tldraw y oculta/muestra la toolbar
- `KeyboardBlocker` usa `stopImmediatePropagation` en el container de tldraw
- Tecla `Q` mientras se mantiene presionada activa `pointerEvents: none` en el bloque para poder moverlo
- En modo código: toolbar de tldraw oculta via `ConditionalToolbar`
- En modo dibujo: toolbar de tldraw visible, Monaco en `readOnly: true`

### Persistencia del canvas
- Se usa `getSnapshot(editor.store)` y `loadSnapshot(editor.store, snapshot)` (funciones importadas de tldraw, NO métodos del store)
- **localStorage**: guardado cada 500ms con debounce mientras el usuario edita
- **Firestore**: guardado solo al salir del canvas (`beforeunload`, `pagehide`, `visibilitychange`)
- Al cargar: se compara `savedAt` de localStorage vs Firestore y se usa el más reciente
- Este esquema minimiza escrituras a Firestore (plan gratuito Spark)

### Firestore — optimización de lecturas
- `getBoards` usa `getDocs` (una sola lectura) en lugar de `onSnapshot` (tiempo real)
- El estado de boards vive en `BoardsPage` y se pasa como props a `BoardList` y `BoardForm`
- La lista se recarga llamando a `refresh()` después de crear o borrar un tablero

### CSS — Responsive
- CSS Modules para todas las pantallas (NO Tailwind)
- Siempre usar variables CSS (`var(--color-accent)`) en lugar de colores hardcodeados
- Breakpoints definidos: 1280px, 1366px, 1440px, 1920px (base), 2560px
- Solo desktop — no hay soporte para mobile ni tablet
- No tiene modo claro (solo dark)

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

### Patrón de lectura Firestore (una sola vez)
```typescript
useEffect(() => {
  if (!user) return
  getBoards(user.uid).then((data) => setBoards(data))
}, [user])
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
- No tiene responsive/mobile (solo desktop, mínimo 1280px)
- No tiene modo claro (solo dark)

---

## Pendiente

- [ ] Landing page pública
- [ ] Registrar dominio (inkode.app o inkode.dev)
- [ ] Conectar formulario de Feedback con Resend (requiere dominio)
- [ ] Login con email/contraseña (baja prioridad, post-lanzamiento)
- [ ] Resolver bug de teclado en Monaco (Delete, Tab, flechas interceptados por tldraw)
