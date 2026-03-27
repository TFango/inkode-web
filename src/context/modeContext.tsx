"use client";
import { createContext, useContext } from "react";

export type Mode = "code" | "draw";

const ModeContext = createContext<{
  mode: Mode;
  setMode: (mode: Mode) => void;
} | null>(null);

export function ModeProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: { mode: Mode; setMode: (mode: Mode) => void };
}) {
  return <ModeContext.Provider value={value}>{children}</ModeContext.Provider>;
}

export function useMode() {
  const ctx = useContext(ModeContext);
  if (!ctx) throw new Error("useMode fuera de provider");
  return ctx;
}
