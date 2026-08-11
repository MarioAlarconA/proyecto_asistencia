import {
  obtenerToken
} from "./auth";

import {
  API_URL
} from "./api";


export type Usuario = {
  id: number;
  nombre: string;
  apellido: string;
  username: string;
  rol: "usuario" | "administrador";
  activo: boolean;
  area_id: number;
  horario_id: number;
  foto_rostro: string | null;
};


// =====================================================
// OBTENER TODOS LOS USUARIOS
// =====================================================

export async function obtenerUsuarios(): Promise<Usuario[]> {

  const token =
    await obtenerToken();

  if (!token) {

    throw new Error(
      "No existe una sesión activa"
    );
  }


  const respuesta =
    await fetch(
      `${API_URL}/usuarios/`,
      {
        method: "GET",

        headers: {
          Authorization:
            `Bearer ${token}`
        }
      }
    );


  const datos =
    await respuesta.json();


  if (!respuesta.ok) {

    throw new Error(
      datos.detail ||
      "No fue posible obtener los usuarios"
    );
  }


  return datos;
}


// =====================================================
// OBTENER USUARIO POR ID
// =====================================================

export async function obtenerUsuarioPorId(
  usuarioId: number
): Promise<Usuario> {

  const token =
    await obtenerToken();

  if (!token) {

    throw new Error(
      "No existe una sesión activa"
    );
  }


  const respuesta =
    await fetch(
      `${API_URL}/usuarios/${usuarioId}`,
      {
        method: "GET",

        headers: {
          Authorization:
            `Bearer ${token}`
        }
      }
    );


  const datos =
    await respuesta.json();


  if (!respuesta.ok) {

    throw new Error(
      datos.detail ||
      "No fue posible obtener el usuario"
    );
  }


  return datos;
}


// =====================================================
// REGISTRAR USUARIO COMPLETO
// =====================================================

export type RegistroUsuario = {
  nombre: string;
  apellido: string;
  username: string;
  password: string;
  rol: "usuario" | "administrador";
  area_id: number;
  horario_id: number;
  fotoUri: string;
};


export async function registrarUsuarioCompleto(
  usuario: RegistroUsuario
) {

  const token =
    await obtenerToken();

  if (!token) {

    throw new Error(
      "No existe una sesión activa"
    );
  }


  const formulario =
    new FormData();


  formulario.append(
    "nombre",
    usuario.nombre
  );


  formulario.append(
    "apellido",
    usuario.apellido
  );


  formulario.append(
    "username",
    usuario.username
  );


  formulario.append(
    "password",
    usuario.password
  );


  formulario.append(
    "rol",
    usuario.rol
  );


  formulario.append(
    "area_id",
    String(usuario.area_id)
  );


  formulario.append(
    "horario_id",
    String(usuario.horario_id)
  );


  formulario.append(
    "archivo",
    {
      uri: usuario.fotoUri,
      name: "rostro.jpg",
      type: "image/jpeg"
    } as any
  );


  const respuesta =
    await fetch(
      `${API_URL}/usuarios/registro-completo`,
      {
        method: "POST",

        headers: {
          Authorization:
            `Bearer ${token}`
        },

        body: formulario
      }
    );


  const datos =
    await respuesta.json();


  if (!respuesta.ok) {

    throw new Error(
      datos.detail ||
      "No fue posible registrar el usuario"
    );
  }


  return datos;
}


// =====================================================
// TIPO PARA ACTUALIZAR USUARIO
// =====================================================

export type ActualizarUsuario = {
  nombre?: string;
  apellido?: string;
  username?: string;
  rol?: "usuario" | "administrador";
  area_id?: number;
  horario_id?: number;
  activo?: boolean;
};


// =====================================================
// ACTUALIZAR USUARIO
// =====================================================

export async function actualizarUsuario(
  usuarioId: number,
  usuario: ActualizarUsuario
) {

  const token =
    await obtenerToken();

  if (!token) {

    throw new Error(
      "No existe una sesión activa"
    );
  }


  const respuesta =
    await fetch(
      `${API_URL}/usuarios/${usuarioId}`,
      {
        method: "PUT",

        headers: {
          Authorization:
            `Bearer ${token}`,

          "Content-Type":
            "application/json"
        },

        body:
          JSON.stringify(usuario)
      }
    );


  const datos =
    await respuesta.json();


  if (!respuesta.ok) {

    throw new Error(
      datos.detail ||
      "No fue posible actualizar el usuario"
    );
  }


  return datos;
}


// =====================================================
// ELIMINAR USUARIO
// =====================================================

export async function eliminarUsuario(
  usuarioId: number
) {

  const token =
    await obtenerToken();

  if (!token) {

    throw new Error(
      "No existe una sesión activa"
    );
  }


  const respuesta =
    await fetch(
      `${API_URL}/usuarios/${usuarioId}`,
      {
        method: "DELETE",

        headers: {
          Authorization:
            `Bearer ${token}`
        }
      }
    );


  const datos =
    await respuesta.json();


  if (!respuesta.ok) {

    throw new Error(
      datos.detail ||
      "No fue posible eliminar el usuario"
    );
  }


  return datos;
}