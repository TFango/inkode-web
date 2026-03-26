import { db } from "./firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  onSnapshot,
  query,
  where,
  deleteDoc,
} from "firebase/firestore";
import { Snippet } from "@/types/snippet";



export async function createSnippet(data: {
  title: string;
  code: string;
  language: string;
  userId: string;
}): Promise<void> {
  const { title, code, language, userId } = data;

  if (!title || !code || !language || !userId) {
    throw Error("Falta data necesaria.");
  }

  await addDoc(collection(db, "snippets"), {
    title,
    code,
    language,
    userId,
    createdAt: serverTimestamp(),
  });
}

export function getSnippets(
  userId: string,
  callback: (snippets: Snippet[]) => void,
): () => void {
  const q = query(collection(db, "snippets"), where("userId", "==", userId));

  const unsubscribe = onSnapshot(q, (snap) => {
    const snippets = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    callback(snippets as Snippet[]);
  });

  return unsubscribe;
}

export async function deleteSnippet(id: string): Promise<void> {
  const userRef = doc(db, "snippets", id);

  await deleteDoc(userRef);
}
