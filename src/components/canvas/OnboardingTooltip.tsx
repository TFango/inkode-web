"use client";

import { useAuth } from "@/context/authContext";
import { completarTour } from "@/lib/users";
import { useState } from "react";

const pasos = [
  {
    titulo: "Cambiá entre modo código y dibujo",
    descripcion:
      'Usá el botón "Código" / "Dibujo" en la barra inferior para cambiar de modo. Si el borde del canvas es naranja, estás en modo dibujo. Si es azul, estás en modo código.',
  },
  {
    titulo: "Agregá un bloque de código",
    descripcion:
      "En modo código o dibujo, usá el botón '+' para agregar un bloque. Solo podés escribir dentro del bloque cuando estás en modo código.",
  },
  {
    titulo: "Copiá el código limpio",
    descripcion:
      "Cada bloque tiene un botón 'Copiar'. El código se copia sin ninguna anotación listo para pegar en tu editor.",
  },
  {
    titulo: "Mové y redimensioná los bloques",
    descripcion:
      "En modo dibujo podés arrastrar los bloques por el canvas. También podés agarrar los bordes para agrandarlos o achicarlos.",
  },
  {
    titulo: "Detección automática de lenguaje",
    descripcion:
      "El lenguaje se detecta solo mientras escribís, pero a veces puede fallar. Podés cambiarlo manualmente desde el selector en la parte superior de cada bloque estando en el modo código.",
  },
];

export default function OnboardingTooltip() {
  const [pasoActual, setPasoActual] = useState<number>(0);
  const [tourIniciado, setTourIniciado] = useState(false);
  const paso = pasos[pasoActual];
  const esUltimo = pasoActual === pasos.length - 1;
  const { user, setTourCompletado } = useAuth();

  async function handleClick() {
    if (esUltimo) {
      await completarTour(user!.uid);
      setTourCompletado(true);
    } else {
      setPasoActual(pasoActual + 1);
    }
  }

  if (!tourIniciado) {
    return (
      <>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0, 0, 0, 0.6)",
            zIndex: 9999,
            pointerEvents: "all",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 10000,
            pointerEvents: "all",
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: 12,
            padding: "32px 40px",
            width: 420,
            display: "flex",
            flexDirection: "column",
            gap: 16,
            boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
            textAlign: "center",
          }}
        >
          <h2 style={{ color: "var(--color-text)", fontSize: "1.25rem", fontWeight: 700, margin: 0 }}>
            Bienvenido a Inkode
          </h2>
          <p style={{ color: "var(--color-text-secondary)", fontSize: "0.9375rem", margin: 0, lineHeight: 1.6 }}>
            Antes de empezar, te mostramos todo lo que podés hacer en menos de un minuto.
            <br />¡Gracias por probar Inkode!
          </p>
          <button
            onClick={() => setTourIniciado(true)}
            style={{
              alignSelf: "center",
              background: "var(--color-accent)",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              padding: "8px 24px",
              fontSize: "0.9375rem",
              fontWeight: 600,
              cursor: "pointer",
              marginTop: 8,
            }}
          >
            Empezar tour →
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0, 0, 0, 0.5)",
          zIndex: 9999,
          pointerEvents: "all",
        }}
      />

      <div
        style={{
          position: "absolute",
          bottom: 24,
          right: 24,
          zIndex: 10000,
          pointerEvents: "all",
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: 10,
          padding: "16px 20px",
          width: 300,
          display: "flex",
          flexDirection: "column",
          gap: 12,
          boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span
            style={{
              fontSize: "0.75rem",
              color: "var(--color-text-secondary)",
              fontFamily: "var(--font-mono)",
            }}
          >
            {pasoActual + 1} / {pasos.length}
          </span>
          <h3
            style={{
              color: "var(--color-text)",
              fontSize: "0.9375rem",
              fontWeight: 600,
              margin: 0,
            }}
          >
            {paso.titulo}
          </h3>
          <p
            style={{
              color: "var(--color-text-secondary)",
              fontSize: "0.875rem",
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            {paso.descripcion}
          </p>
        </div>

        <button
          onClick={handleClick}
          style={{
            alignSelf: "flex-end",
            background: "var(--color-accent)",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            padding: "6px 16px",
            fontSize: "0.875rem",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {esUltimo ? "Entendido ✓" : "Siguiente →"}
        </button>
      </div>
    </>
  );
}
