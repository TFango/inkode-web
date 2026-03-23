// components/boards/BoardCanvas.tsx — cliente, con hooks y tldraw
"use client";

import { Tldraw } from "tldraw";
import "tldraw/tldraw.css";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import CanvasPesistence from "./CanvasPesistence";

export default function BoardCanvas({ boardId }: { boardId: string }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading]);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Tldraw
        inferDarkMode
        components={{
          InFrontOfTheCanvas: () => <CanvasPesistence boardId={boardId} />,
        }}
      />
    </div>
  );
}
