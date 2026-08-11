import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

import * as SecureStore from "expo-secure-store";

import {
  cerrarSesion as borrarSesionGuardada
} from "../services/auth";


type Rol =
  | "usuario"
  | "administrador";


type AuthContextType = {
  token: string | null;
  rol: Rol | null;
  cargando: boolean;

  establecerSesion: (
    token: string,
    rol: Rol
  ) => void;

  cerrarSesion: () => Promise<void>;
};


const AuthContext =
  createContext<AuthContextType | null>(
    null
  );


export function AuthProvider({
  children
}: PropsWithChildren) {

  const [token, setToken] =
    useState<string | null>(null);

  const [rol, setRol] =
    useState<Rol | null>(null);

  const [cargando, setCargando] =
    useState(true);


  useEffect(() => {

    const cargarSesion = async () => {

      try {

        const tokenGuardado =
          await SecureStore.getItemAsync(
            "access_token"
          );

        const rolGuardado =
          await SecureStore.getItemAsync(
            "rol"
          );

        if (
          rolGuardado === "usuario" ||
          rolGuardado === "administrador"
        ) {
          setRol(rolGuardado);
        }

        setToken(tokenGuardado);

      } catch (error) {

        console.log(
          "Error cargando sesión:",
          error
        );

      } finally {

        setCargando(false);
      }
    };


    cargarSesion();

  }, []);


  const establecerSesion = (
    nuevoToken: string,
    nuevoRol: Rol
  ) => {

    setToken(nuevoToken);
    setRol(nuevoRol);
  };


  const cerrarSesion = async () => {

    await borrarSesionGuardada();

    setToken(null);
    setRol(null);
  };


  return (

    <AuthContext.Provider
      value={{
        token,
        rol,
        cargando,
        establecerSesion,
        cerrarSesion
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}


export function useAuth() {

  const contexto =
    useContext(AuthContext);

  if (!contexto) {

    throw new Error(
      "useAuth debe utilizarse dentro de AuthProvider"
    );
  }

  return contexto;
}