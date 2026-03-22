"use client";

import { useAuth } from "@/context/authContext";
import { createSnippet } from "@/lib/snippets";
import { useState } from "react";

export default function SnippetForm() {
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async () => {
    if (!user) return;
    setLoading(true);

    try {
      await createSnippet({ title, code, language, userId: user.uid });

      setTitle("");
      setCode("");
      setLanguage("javascript");
    } catch (err) {
      console.error("Error al guardar: ", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <div>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Titulo del snippet"
        />

        <select
          name="language"
          id="language"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="javascript">javascript</option>
          <option value="typeScript">typeScript</option>
          <option value="python">python</option>
          <option value="java">java</option>
          <option value="html">html</option>
          <option value="css">css</option>
        </select>

        <textarea
          name="code"
          id="code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="codigo"
        />

        <button onClick={handleSubmit} disabled={loading}>
          {loading ? "Guardando..." : "Guardar"}
        </button>
      </div>
    </section>
  );
}
