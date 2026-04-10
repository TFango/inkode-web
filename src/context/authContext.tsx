"use client";
import { auth } from "@/lib/firebase";
import {
  GoogleAuthProvider,
  signOut,
  signInWithPopup,
  getAdditionalUserInfo,
  User,
  onAuthStateChanged,
} from "firebase/auth";
import { createBoard } from "@/lib/boards";
import { createContext, useContext, useEffect, useState } from "react";
import { createUserProfile, getUserProfile } from "@/lib/users";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  tourCompletado: boolean | null;
  setTourCompletado: (value: boolean) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [tourCompletado, setTourCompletado] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsuscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);

      if (user) {
        getUserProfile(user.uid).then((profile) => {
          setTourCompletado(profile?.tourCompletado ?? false);
        });
      } else {
        setTourCompletado(null);
      }
    });
    return () => unsuscribe();
  }, []);

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const isNewUser = getAdditionalUserInfo(result)?.isNewUser;
      if (isNewUser) {
        await createBoard({
          name: "Mi primer tablero",
          userId: result.user.uid,
        });
        await createUserProfile(result.user.uid);
      }
    } catch (error: any) {
      if (error?.code === "auth/popup-closed-by-user") return;
      throw error;
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{
        loginWithGoogle,
        logout,
        user,
        loading,
        tourCompletado,
        setTourCompletado,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("authContext debe usarse dentro de authProvider");
  return context;
}
