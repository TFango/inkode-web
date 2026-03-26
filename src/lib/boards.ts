import {
  collection,
  serverTimestamp,
  addDoc,
  query,
  where,
  onSnapshot,
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

export function getBoards(userId: string, callback: (boards: Board[]) => void) {
  // Query para traer solo los tableros del usuario actual
  const q = query(collection(db, "boards"), where("userId", "==", userId));

  //Listener en tiempo real
  // onSnapshot -> Crea una conexion en tiempo real que notifica cada cambio
  const unsubscribe = onSnapshot(q, (snap) => {
    // Convierte cada documento en un objeto usable
    const boards = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    callback(boards as Board[]); // Devuelve los datos al componente
  });

  return unsubscribe; // Retorna funcion para cortar la subscripcion, necesaria para cuando el componente se desmonta
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
  const ref = doc(db, "boards", boardId); // Referencia al documento del tablero


  // Guarda el snapshot en el campo "canvas"
  // merge: true -> Evita sobreescribir otros campos como name o userId
  await setDoc(ref, { canvas: snapshot }, { merge: true });
}


// CARGAR SNAPSHOT DEL CANVAS

export async function loadBoardCanvas(
  boardId: string,
): Promise<unknown | null> {
  const ref = await getDoc(doc(db, "boards", boardId)); // Busca el documento del tablero

  if (!ref.exists()) { // Si no existe retorna null
    return null;
  }

  // Devuelve el campo canvas si existe
  return ref.data()?.canvas ?? null;
}
