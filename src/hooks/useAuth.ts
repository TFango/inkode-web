import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import {
  GoogleAuthProvider,
  signOut,
  signInWithPopup,
  User,
} from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null); // Crea un pequeño estado para el usuario
  const [loading, setLoading] = useState(true); // Crea un pequeño estado para saber sobre la carga

  useEffect(() => { // Es una funcion que se dispara al montar el componente, por los "[]"
    const unsuscribe = onAuthStateChanged(auth, (user) => { // unsuscribe es una funcion de cancelacion, al montarse el componente se crea un canal de escucha
      setUser(user); // verifica el canal de escucha si esta logeado o no, para guardarlo en el pequeño estado
      setLoading(false); // pone el loading en false para desbloquear la UI
    });
    return () => unsuscribe(); // Funcion de limpieza para cuando el componente se desmonte
  }, []);

  const loginWithGoogle = async () => { // Funcion para poder iniciar sesion con google, si es con github tendria su propia funcion
    const provider = new GoogleAuthProvider(); // Crea un provedor que le dice a Firebase que quiere usar "Google para autenticar"
    await signInWithPopup(auth, provider); // Funcion que abre el popup de google, recibe la instancia de firebase para saber que app es, provider para saber que popup abrir
  };

  const logout = async () => { // Funcion para deslogearse
    await signOut(auth);  // signOut es una funcion de google, recibe la app que es
  };

  return { user, loading, loginWithGoogle, logout };
}
