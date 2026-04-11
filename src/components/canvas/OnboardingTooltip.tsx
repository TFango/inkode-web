"use client";

import { useAuth } from "@/context/authContext";
import { completarTour } from "@/lib/users";
import { useState } from "react";

/* ─── Pasos del tour ─────────────────────────────────────────────────────── */

const pasos = [
  {
    icono: "⬛",
    titulo: "Dos modos de trabajo",
    descripcion:
      "El botón inferior cambia entre modo Código y modo Dibujo. El borde del canvas te indica en cuál estás: azul para código, naranja para dibujo.",
    hint: "Mirá el botón en la barra inferior",
  },
  {
    icono: "＋",
    titulo: "Agregá bloques de código",
    descripcion:
      'Presioná el botón "+" para crear un bloque. Escribís dentro solo en modo Código — en modo Dibujo los bloques quedan en solo lectura.',
    hint: "Botón + en la barra inferior",
  },
  {
    icono: "⧉",
    titulo: "Copiá el código limpio",
    descripcion:
      "El botón Copiar de cada bloque copia el código sin anotaciones, listo para pegar en tu editor. Las notas solo viven en el canvas.",
    hint: "Botón Copiar en la esquina de cada bloque",
  },
  {
    icono: "⤢",
    titulo: "Mové y redimensioná",
    descripcion:
      "En modo Dibujo podés arrastrar cualquier bloque por el canvas y estirar sus bordes para ajustar el tamaño.",
    hint: "Activá modo Dibujo primero",
  },
  {
    icono: "{ }",
    titulo: "Detección de lenguaje automática",
    descripcion:
      "El lenguaje se detecta solo mientras escribís. Si no es correcto, podés cambiarlo desde el selector en la parte superior del bloque.",
    hint: "Selector de lenguaje en cada bloque",
  },
];

/* ─── Tokens de color (inline styles sobre el canvas) ───────────────────── */

const C = {
  bg:          "#1a1a1a",
  bgDeep:      "#141414",
  border:      "rgba(42, 42, 42, 0.9)",
  borderAccent:"rgba(59, 130, 246, 0.4)",
  text:        "#f0f0f0",
  textSec:     "#888888",
  accent:      "#3b82f6",
  accentBg:    "rgba(59, 130, 246, 0.12)",
  accentBorder:"rgba(59, 130, 246, 0.35)",
  draw:        "#f97316",
  overlay:     "rgba(0, 0, 0, 0.65)",
  mono:        '"JetBrains Mono", monospace',
};

/* ─── Componente ─────────────────────────────────────────────────────────── */

export default function OnboardingTooltip() {
  const [pasoActual, setPasoActual]     = useState(0);
  const [tourIniciado, setTourIniciado] = useState(false);
  const { user, setTourCompletado }     = useAuth();

  const paso    = pasos[pasoActual];
  const esUltimo = pasoActual === pasos.length - 1;
  const progreso = ((pasoActual + 1) / pasos.length) * 100;

  async function handleCompletarTour() {
    await completarTour(user!.uid);
    setTourCompletado(true);
  }

  async function handleClick() {
    if (esUltimo) {
      await handleCompletarTour();
    } else {
      setPasoActual(pasoActual + 1);
    }
  }

  /* ── Pantalla de bienvenida ── */
  if (!tourIniciado) {
    return (
      <>
        {/* Overlay */}
        <div style={{ position: "absolute", inset: 0, background: C.overlay, zIndex: 9999, pointerEvents: "all" }} />

        {/* Modal de bienvenida */}
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 10000, pointerEvents: "all",
          background: C.bg,
          border: `1px solid ${C.border}`,
          borderRadius: 14,
          width: 460,
          overflow: "hidden",
          boxShadow: "0 16px 48px rgba(0,0,0,0.6)",
        }}>
          {/* Franja de color — modo código y modo dibujo */}
          <div style={{
            height: 3,
            background: `linear-gradient(90deg, ${C.accent} 0%, ${C.accent} 50%, ${C.draw} 50%, ${C.draw} 100%)`,
          }} />

          <div style={{ padding: "32px 36px 36px", display: "flex", flexDirection: "column", gap: 24 }}>
            {/* Header */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8, textAlign: "center" }}>
              <h2 style={{ color: C.text, fontSize: "1.45rem", fontWeight: 700, margin: 0, letterSpacing: "-0.02em" }}>
                Bienvenido a Inkode
              </h2>
              <p style={{ color: C.textSec, fontSize: "1rem", margin: 0, lineHeight: 1.6 }}>
                Un tour rápido de 5 pasos para que empieces sin dudas.
              </p>
            </div>

            {/* Preview de los 3 conceptos clave */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { color: C.accent,  label: "Modo Código",  sub: "Escribí y organizá snippets" },
                { color: C.draw,    label: "Modo Dibujo",  sub: "Anotá y conectá ideas encima" },
                { color: "rgba(167, 139, 250, 0.7)", label: "Copia limpia", sub: "El código siempre queda sin anotaciones" },
              ].map((item) => (
                <div key={item.label} style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "11px 14px", borderRadius: 9,
                  background: C.bgDeep,
                  border: `1px solid ${C.border}`,
                }}>
                  <div style={{
                    width: 9, height: 9, borderRadius: "50%", flexShrink: 0,
                    background: item.color,
                    boxShadow: `0 0 6px ${item.color}`,
                  }} />
                  <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <span style={{ fontSize: "0.925rem", fontWeight: 600, color: C.text }}>{item.label}</span>
                    <span style={{ fontSize: "0.825rem", color: C.textSec }}>{item.sub}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "center" }}>
              <button
                onClick={() => setTourIniciado(true)}
                style={{
                  width: "100%",
                  background: C.accentBg,
                  color: "#e8effe",
                  border: `1px solid ${C.accentBorder}`,
                  borderRadius: 9,
                  padding: "11px 24px",
                  fontSize: "1rem",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Empezar tour →
              </button>
              <button
                onClick={handleCompletarTour}
                style={{
                  background: "transparent", border: "none",
                  color: C.textSec, fontSize: "0.85rem", cursor: "pointer",
                  fontFamily: C.mono, letterSpacing: "0.01em",
                  padding: "2px 8px",
                }}
              >
                Saltar — ya sé cómo funciona
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  /* ── Pasos del tour ── */
  return (
    <>
      {/* Overlay */}
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 9999, pointerEvents: "all" }} />

      {/* Tooltip */}
      <div style={{
        position: "absolute", bottom: 24, right: 24,
        zIndex: 10000, pointerEvents: "all",
        background: C.bg,
        border: `1px solid ${C.border}`,
        borderRadius: 12,
        width: 360,
        overflow: "hidden",
        boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
      }}>
        {/* Barra de progreso */}
        <div style={{ height: 2, background: C.bgDeep }}>
          <div style={{
            height: "100%",
            width: `${progreso}%`,
            background: C.accent,
            transition: "width 300ms ease",
          }} />
        </div>

        <div style={{ padding: "18px 20px", display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Contador + ícono del paso */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{
              fontFamily: C.mono, fontSize: "0.78rem", color: C.textSec, letterSpacing: "0.03em",
            }}>
              {pasoActual + 1} / {pasos.length}
            </span>
            <span style={{
              fontFamily: C.mono, fontSize: "0.78rem",
              color: C.accent,
              background: C.accentBg,
              border: `1px solid ${C.accentBorder}`,
              borderRadius: 4, padding: "2px 9px",
            }}>
              {paso.icono}
            </span>
          </div>

          {/* Contenido */}
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            <h3 style={{ color: C.text, fontSize: "1rem", fontWeight: 600, margin: 0, letterSpacing: "-0.01em" }}>
              {paso.titulo}
            </h3>
            <p style={{ color: C.textSec, fontSize: "0.9rem", margin: 0, lineHeight: 1.6 }}>
              {paso.descripcion}
            </p>
          </div>

          {/* Hint — dónde mirar */}
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "7px 10px", borderRadius: 7,
            background: C.bgDeep,
            border: `1px solid ${C.border}`,
          }}>
            <span style={{ fontSize: "0.75rem", color: C.accent, lineHeight: 1 }}>→</span>
            <span style={{
              fontFamily: C.mono, fontSize: "0.76rem", color: C.textSec, lineHeight: 1.3,
            }}>
              {paso.hint}
            </span>
          </div>

          {/* Botones */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
            {/* Dots de progreso */}
            <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
              {pasos.map((_, i) => (
                <div key={i} style={{
                  width: i === pasoActual ? 16 : 6,
                  height: 6,
                  borderRadius: 999,
                  background: i === pasoActual ? C.accent : i < pasoActual ? "rgba(59,130,246,0.35)" : C.border,
                  transition: "width 250ms ease, background 250ms ease",
                }} />
              ))}
            </div>

            <div style={{ display: "flex", gap: 7 }}>
              {/* Saltar */}
              <button
                onClick={handleCompletarTour}
                style={{
                  background: "transparent", border: "none",
                  color: C.textSec, fontSize: "0.82rem", cursor: "pointer",
                  fontFamily: C.mono, padding: "5px 7px", borderRadius: 5,
                }}
              >
                Saltar
              </button>

              {/* Siguiente / Listo */}
              <button
                onClick={handleClick}
                style={{
                  background: C.accentBg,
                  color: "#e8effe",
                  border: `1px solid ${C.accentBorder}`,
                  borderRadius: 7,
                  padding: "6px 18px",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                {esUltimo ? "¡Listo!" : "Siguiente →"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
