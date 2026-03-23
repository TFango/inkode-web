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
import { mergeUseCacheTrackers } from "next/dist/build/webpack/plugins/telemetry-plugin/use-cache-tracker-utils";

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

export async function saveBoardCanvas(
  boardId: string,
  snapshot: unknown,
): Promise<void> {
  const ref = doc(db, "boards", boardId);

  await setDoc(ref, { canvas: snapshot }, { merge: true });
}

export async function loadBoardCanvas(
  boardId: string,
): Promise<unknown | null> {
  const ref = await getDoc(doc(db, "boards", boardId));

  if (!ref.exists()) {
    return null;
  }

  return ref.data()?.canvas ?? null;
}
