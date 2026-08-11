import * as SecureStore from "expo-secure-store";

import { API_URL } from "./api";


export type LoginResponse = {
  access_token: string;
  token_type: string;
  usuario_id: number;
  username: string;
  rol: "usuario" | "administrador";
};


export async function iniciarSesion(
  username: string,
  password: string
): Promise<LoginResponse> {

  const respuesta = await fetch(
    `${API_URL}/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    }
  );

  const datos = await respuesta.json();

  if (!respuesta.ok) {

    throw new Error(
      datos.detail ||
      "No fue posible iniciar sesión"
    );
  }

  await SecureStore.setItemAsync(
    "access_token",
    datos.access_token
  );

  await SecureStore.setItemAsync(
    "rol",
    datos.rol
  );

  await SecureStore.setItemAsync(
    "usuario_id",
    String(datos.usuario_id)
  );

  await SecureStore.setItemAsync(
    "username",
    datos.username
  );

  return datos;
}


export async function obtenerToken() {

  return await SecureStore.getItemAsync(
    "access_token"
  );
}


export async function cerrarSesion() {

  await SecureStore.deleteItemAsync(
    "access_token"
  );

  await SecureStore.deleteItemAsync(
    "rol"
  );

  await SecureStore.deleteItemAsync(
    "usuario_id"
  );

  await SecureStore.deleteItemAsync(
    "username"
  );
}