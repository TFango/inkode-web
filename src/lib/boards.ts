import {
  collection,
  serverTimestamp,
  addDoc,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import { Board } from "@/types/board";


// CREAR TABLERO

export async function createBoard(data: {
  name: string;
  userId: string;
}): Promise<void> {
  const { name, userId } = data;

  if (!name || !userId) {
    throw Error("Falta data necesaria.");
  }

  // Crea un nuevo documento en la collecion "boards"
  await addDoc(collection(db, "boards"), {
    name,
    userId,
    createdAt: serverTimestamp(),
  });
}

// OBTENER TABLEROS DEL USUARIO

export async function getBoards(userId: string): Promise<Board[]> {
  const q = query(collection(db, "boards"), where("userId", "==", userId));
  const snap = await getDocs(q);
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Board[];
}

// ELIMINAR TABLERO

export async function deleteBoard(id: string): Promise<void> {
  // Referencia al documento del tablero
  const boardRef = doc(db, "boards", id);

  await deleteDoc(boardRef); // Elimina el documento
}

// GUARDAR SNAPSHOT DEL CANVAS

export async function saveBoardCanvas(
  boardId: string,
  snapshot: unknown,
): Promise<void> {
  const serialized = JSON.stringify(snapshot);
  const sizeKB = new Blob([serialized]).size / 1024;

  if (sizeKB > 800) {
    console.warn(`[inkode] Canvas muy grande: ${sizeKB.toFixed(0)}KB. Límite Firestore: 1024KB.`);
  }

  if (sizeKB >= 1024) {
    console.error("[inkode] Canvas supera 1MB, no se guardó en Firestore.");
    return;
  }

  const ref = doc(db, "boards", boardId);
  await setDoc(ref, { canvas: snapshot, canvasSavedAt: Date.now() }, { merge: true });
}


// CARGAR SNAPSHOT DEL CANVAS

export async function loadBoardCanvas(
  boardId: string,
): Promise<{ snapshot: unknown; savedAt: number } | null> {
  const ref = await getDoc(doc(db, "boards", boardId));

  if (!ref.exists()) return null;

  const data = ref.data();
  if (!data?.canvas) return null;

  const sizeKB = new Blob([JSON.stringify(data.canvas)]).size / 1024;
  console.log(`[inkode] Canvas cargado: ${sizeKB.toFixed(0)}KB`);

  return { snapshot: data.canvas, savedAt: data.canvasSavedAt ?? 0 };
}
