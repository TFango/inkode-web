"use client";

import { useAuth } from "@/context/authContext";
import { deleteSnippet, getSnippets } from "@/lib/snippets";
import { useEffect, useState } from "react";
import { Snippet } from "@/types/snippet";

export default function SnippetList() {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    const unsuscribe = getSnippets(user.uid, (data) => setSnippets(data));

    return () => unsuscribe();
  }, [user]);

  const handleDelete = async (id: string) => {
    setLoading(true);

    try {
      await deleteSnippet(id);
    } catch (err) {
      console.error("Error al borrar el snipet", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <div>
        {snippets.length === 0 ? (
          <p>No tenes snipets cargados</p>
        ) : (
          snippets.map((s: Snippet) => (
            <div key={s.id}>
              <p>{s.title}</p>
              <p>{s.language}</p>
              <p>{s.code}</p>
              <button onClick={() => handleDelete(s.id)}>
                {loading ? "Borrando..." : "Eliminar"}
              </button>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
