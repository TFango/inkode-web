import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

export async function createUserProfile(userId: string): Promise<void> {
  if (!userId) {
    throw Error("Falta data necesaria");
  }

  await setDoc(doc(db, "users", userId), {
    tourCompletado: false,
  });
}

export async function getUserProfile(
  userId: string,
): Promise<{ tourCompletado: boolean } | null> {
  const ref = doc(db, "users", userId);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;
  return snap.data() as { tourCompletado: boolean };
}

export async function completarTour(userId: string): Promise<void> {
  if (!userId) {
    throw Error("Falta data necesaria");
  }

  const ref = doc(db, "users", userId);
  await setDoc(ref, { tourCompletado: true }, { merge: true });
}
