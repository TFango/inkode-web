# Inkode — Interface Design System

## Direction & Feel

**Product world:** Canvas infinito para developers. Espacio de trabajo a medianoche — pantalla oscura, cursor parpadeando, syntax highlighting, bloques de código flotando en el canvas.

**Feel:** Herramienta seria y precisa. Frío técnico, no frío corporativo. Como un IDE bien diseñado, no como un SaaS genérico.

**Signature element:** Fragmentos de código decorativos flotando en el fondo (posición fija, opacidad baja, rotación leve) — el canvas siempre está "vivo" detrás de la UI.

---

## Paleta

Usar siempre las variables CSS del proyecto:

```css
--color-bg:              #111111;
--color-surface:         #1e1e1e;
--color-border:          #2a2a2a;
--color-text:            #f0f0f0;
--color-text-secondary:  #888888;
--color-accent:          #3b82f6;   /* azul — modo código */
--color-accent-hover:    #2563eb;
--color-danger:          #ef4444;
--color-danger-hover:    #dc2626;
--color-draw:            #f97316;   /* naranja — modo dibujo */
```

**Nunca** usar hex hardcodeados salvo para rgba con opacidad sobre los colores de la paleta.

---

## Depth Strategy

**Borders-only** — sin box-shadow dramáticas. Apropiado para herramienta técnica densa.

- Borders estándar: `1px solid rgba(42, 42, 42, 0.8)`
- Borders de énfasis: `1px solid rgba(59, 130, 246, 0.35)`
- Glow en hover (solo elementos interactivos clave): `box-shadow: 0 0 20px rgba(59, 130, 246, 0.15)`
- Sombra de layout (video frame, modales): `0 8px 32px rgba(0, 0, 0, 0.5)` — una sola capa, discreta

---

## Tipografía

- **UI / copy:** Inter (heredada del body)
- **Código / monospace / badges técnicos:** `JetBrains Mono, monospace`
- **Títulos:** `font-weight: 700`, `letter-spacing: -0.02em`, `line-height: 1.15`
- **Body:** `font-weight: 400`, `line-height: 1.65`
- **Labels / badges:** `font-size: 0.78rem`, `letter-spacing: 0.02em`

---

## Spacing

Base unit: `0.25rem` (4px). Escala en múltiplos:

| Uso | Valor |
|---|---|
| Micro (gap íconos) | `0.45rem` |
| Componente (padding botón) | `0.85rem 1.4rem` |
| Sección (gap entre grupos) | `1.75rem` |
| Layout (gap columnas) | `4–5rem` |

---

## Componentes definidos

### Badge técnico
Pill pequeño con punto pulsante, tipografía monospace, fondo `rgba(accent, 0.08)`, borde `rgba(accent, 0.25)`.
```css
padding: 0.3rem 0.75rem;
border-radius: 999px;
font-family: "JetBrains Mono", monospace;
font-size: 0.78rem;
background: rgba(59, 130, 246, 0.08);
border: 1px solid rgba(59, 130, 246, 0.25);
color: #93b4f8;
```
Punto: `6px`, `border-radius: 50%`, `box-shadow: 0 0 6px rgba(59, 130, 246, 0.8)`.

### Feature pill / fila de feature
Ícono en micro-contenedor `22x22px`, `border-radius: 6px`, fondo `rgba(accent, 0.1)`, borde `rgba(accent, 0.2)`. Texto en `--color-text-secondary`, `0.9rem`.

### Botón CTA principal
No sólido — translúcido con borde de énfasis.
```css
background: rgba(59, 130, 246, 0.12);
border: 1px solid rgba(59, 130, 246, 0.35);
color: #e8effe;
border-radius: 10px;
```
Hover: `background: rgba(59, 130, 246, 0.2)`, `border-color: rgba(59, 130, 246, 0.6)`, glow sutil.
`::before` con gradiente interno que aparece en hover.

### Video / imagen frame (tipo tablero)
Marco con borde gradiente `accent → border → draw` de 2px. Barra de título interna con 3 dots de colores (rojo/amarillo/verde a 50–60% opacidad) y título en monospace.
```css
border-radius: 14px;
padding: 2px;
background: linear-gradient(135deg, rgba(59,130,246,0.35) 0%, rgba(42,42,42,0.5) 40%, rgba(249,115,22,0.2) 100%);
```

### Canvas decoration (fondo)
Bloques de código `position: fixed`, `pointer-events: none`, `z-index: 0`.
`background: rgba(30,30,30,0.7)`, border sutil, `font-size: 0.72rem`, opacidad 25–60%, rotaciones ±2°.
En pantallas ≤1280px ocultar 2 de los 5 bloques para no saturar.

---

## Patrones estructurales

- **Layouts de página:** dos columnas (copy + media) centradas con `max-width: 1400px`
- **Jerarquía de color en títulos:** palabra clave en `--color-accent`, resto en `--color-text`
- **Footer fijo:** `position: fixed`, `bottom: 1.5rem`, centrado con `translateX(-50%)`, separador `1px` vertical entre elementos
- **Solo desktop:** breakpoints en 1280 / 1366 / 1440 / 1920 / 2560px. Sin mobile.
- **Solo dark mode**

---

## Lo que NO hacer

- No Tailwind — solo CSS Modules
- No colores hardcodeados sin opacidad (usar `var()` o `rgba` sobre la paleta)
- No box-shadows dramáticas ni múltiples capas de sombra
- No gradientes decorativos sin propósito semántico
- No mezclar depth strategies (borders vs shadows)
- No `<select>` ni `<input type="date">` nativos — construir custom
