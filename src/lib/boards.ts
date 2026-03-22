import {
  collection,
  serverTimestamp,
  addDoc,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "./firebase";
import { Board } from "@/types/board";

export async function createBoard(data: {
  name: string;
  userId: string;
}): Promise<void> {
  const { name, userId } = data;

  if (!name || !userId) {
    throw Error("Falta data necesaria.");
  }

  await addDoc(collection(db, "boards"), {
    name,
    userId,
    createdAt: serverTimestamp(),
  });
}

export function getBoards(userId: string, callback: (boards: Board[]) => void) {
  const q = query(collection(db, "boards"), where("userId", "==", userId));

  const unsubscribe = onSnapshot(q, (snap) => {
    const boards = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    callback(boards as Board[]);
  });

  return unsubscribe;
}

export async function deleteBoard(id: string): Promise<void> {
  const boardRef = doc(db, "boards", id);

  await deleteDoc(boardRef);
}
