# Inkode — Contexto del Proyecto para Claude

Responde siempre en español.

> **ADVERTENCIA — PROYECTO EN PRODUCCIÓN**
> Inkode está lanzado como MVP en https://inkode-web.vercel.app, fue presentado y sigue siendo presentado ante comisiones de la facultad. Hay usuarios reales activos. Antes de cualquier modificación, considerar el impacto en producción: no romper flujos existentes, no hacer cambios destructivos en Firestore, trabajar siempre en ramas separadas y mergear a `main` solo cuando esté probado.

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
| Analytics | Posthog (`posthog-js`) |

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
--color-draw:            #f97316;
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
    (shared)/
      shared/
        [boardId]/
          page.tsx        ← vista pública de tablero compartido (server component, verifica isPublic)
      layout.tsx          ← layout sin header para vistas compartidas
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
      ModeToggleButton.tsx     ← botón cambiar entre modos (texto "Código"/"Dibujo")
      OnboardingTooltip.tsx    ← tour guiado para nuevos usuarios
      SharedCanvas.tsx         ← canvas público de solo lectura (tldraw readOnly + ModeProvider fijo)
      SharedBadge.tsx          ← badge "Hecho con Inkode" con link a /login
      SaveBoardButton.tsx      ← botón para duplicar un tablero compartido a la cuenta del usuario
    layout/
      header/
        Header.tsx         ← header con variante login/app
        Header.module.css
  context/
    authContext.tsx        ← AuthProvider + useAuth hook
    modeContext.tsx        ← ModeProvider + useMode hook
    posthogContext.tsx     ← inicialización de Posthog + PosthogProvider + identificación de usuario
  hooks/
    useAnalytics.ts        ← hook useAnalytics() para trackear eventos
  lib/
    boards.ts             ← CRUD de tableros + saveBoardCanvas + loadBoardCanvas + getBoardById + setBoardPublic
    users.ts              ← createUserProfile, getUserProfile, completarTour
    firebase.ts           ← inicialización de Firebase
  types/
    board.ts              ← type Board
  data/
    actualizaciones.ts    ← array estático de versiones (SemVer)
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
        ├── isPublic?: boolean  ← si true, cualquiera puede leer sin auth
        └── canvas: object  ← snapshot de tldraw (getSnapshot/loadSnapshot)

users (colección)
  └── userId  ← mismo uid de Firebase Auth
        └── tourCompletado: boolean
```

**Reglas de seguridad:** cada usuario solo puede leer/escribir sus propios documentos. Excepción: `boards` con `isPublic === true` son legibles por cualquiera (incluso sin auth).

**Nota sobre usuarios existentes:** los usuarios registrados antes de la colección `users` no tienen documento. `getUserProfile` retorna `null` para ellos, lo que se trata igual que `tourCompletado: false` — el tour aparece igual y al terminar se crea el documento.

---

## Decisiones Técnicas Importantes

### Auth
- Solo Google via `GoogleAuthProvider` + `signInWithPopup`
- El error `auth/popup-closed-by-user` se ignora silenciosamente (es acción válida del usuario)
- Si el usuario es nuevo (`getAdditionalUserInfo(result)?.isNewUser`), se crea un tablero default y un perfil en `users` automáticamente
- El estado global de auth vive en `AuthContext` — nunca llamar Firebase directamente desde componentes
- `useAuth()` se importa siempre desde `@/context/authContext`
- `AuthContext` expone `tourCompletado` (boolean | null) y `setTourCompletado` para controlar el onboarding

### Canvas — tldraw
- `BoardCanvas.tsx` es el único componente cliente que monta `<Tldraw>` para el dueño
- `SharedCanvas.tsx` monta `<Tldraw>` para visitantes — usa `editor.updateInstanceState({ isReadonly: true })` via `onMount` para bloquear toda edición. Pan y zoom siguen funcionando.
- En `SharedCanvas`, `ModeProvider` se monta con `mode: "draw"` fijo para que Monaco quede en `readOnly`
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
- En modo código: toolbar de tldraw oculta via `ConditionalToolbar`
- En modo dibujo: toolbar de tldraw visible, Monaco en `readOnly: true`

### Persistencia del canvas
- Se usa `getSnapshot(editor.store)` y `loadSnapshot(editor.store, snapshot)` (funciones importadas de tldraw, NO métodos del store)
- **localStorage**: guardado cada 500ms con debounce mientras el usuario edita
- **Firestore**: guardado solo al salir del canvas (`beforeunload`, `pagehide`, `visibilitychange`)
- Al cargar: se compara `savedAt` de localStorage vs Firestore y se usa el más reciente
- Este esquema minimiza escrituras a Firestore (plan gratuito Spark)

### Analytics — Posthog
- Inicializado en `posthogContext.tsx` con autocapture y session recording desactivados (evitar ruido del canvas)
- El usuario se identifica automáticamente con su uid, email y nombre al loguearse
- `useAnalytics()` desde `@/hooks/useAnalytics` expone `track(event, properties)`
- Eventos trackeados: `code_block_created`, `code_copied` (con lenguaje), `$pageview`, `$pageleave`
- Variables de entorno: `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST`

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
- ~~No es para compartir código públicamente~~ — ya se puede compartir tableros con link público
- No tiene responsive/mobile (solo desktop, mínimo 1280px)
- No tiene modo claro (solo dark)

---

## Pendiente

- [ ] Landing page pública
- [ ] Registrar dominio (inkode.app o inkode.dev)
- [ ] Conectar formulario de Feedback con Resend (requiere dominio)
- [ ] Login con email/contraseña (baja prioridad, post-lanzamiento)
- [ ] Resolver bug de teclado en Monaco (Delete, Tab, flechas interceptados por tldraw)
- [ ] Toggle para volver a hacer privado un tablero (campo `isPublic` ya lo soporta)
- [ ] Botón de copiar código en vista compartida
