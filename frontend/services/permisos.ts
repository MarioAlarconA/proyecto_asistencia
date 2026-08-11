import { obtenerToken } from "./auth";
import { API_URL } from "./api";


export type EstadoPermiso =
  | "pendiente"
  | "aprobado"
  | "rechazado";


export type Permiso = {
  id: number;
  usuario_id: number;
  tipo: string;
  fecha_inicio: string;
  fecha_fin: string;
  motivo: string | null;
  estado: string;
};


export type CrearPermiso = {
  tipo: string;
  fecha_inicio: string;
  fecha_fin: string;
  motivo?: string;
};


export type ActualizarPermiso = {
  tipo?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  motivo?: string;
  estado?: EstadoPermiso;
};


// =====================================================
// OBTENER TODOS LOS PERMISOS - ADMIN
// =====================================================

export async function obtenerPermisos(): Promise<Permiso[]> {

  const token = await obtenerToken();

  if (!token) {
    throw new Error(
      "No existe una sesión activa"
    );
  }


  const respuesta = await fetch(
    `${API_URL}/permisos/`,
    {
      method: "GET",

      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );


  const datos = await respuesta.json();


  if (!respuesta.ok) {

    throw new Error(
      datos.detail ||
      "No fue posible obtener los permisos"
    );
  }


  return datos;
}


// =====================================================
// OBTENER MIS PERMISOS - USUARIO
// =====================================================

export async function obtenerMisPermisos(): Promise<Permiso[]> {

  const token = await obtenerToken();

  if (!token) {
    throw new Error(
      "No existe una sesión activa"
    );
  }


  const respuesta = await fetch(
    `${API_URL}/permisos/mis-permisos`,
    {
      method: "GET",

      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );


  const datos = await respuesta.json();


  if (!respuesta.ok) {

    throw new Error(
      datos.detail ||
      "No fue posible obtener tus permisos"
    );
  }


  return datos;
}


// =====================================================
// OBTENER PERMISO POR ID
// =====================================================

export async function obtenerPermisoPorId(
  permisoId: number
): Promise<Permiso> {

  const token = await obtenerToken();

  if (!token) {
    throw new Error(
      "No existe una sesión activa"
    );
  }


  const respuesta = await fetch(
    `${API_URL}/permisos/${permisoId}`,
    {
      method: "GET",

      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );


  const datos = await respuesta.json();


  if (!respuesta.ok) {

    throw new Error(
      datos.detail ||
      "No fue posible obtener el permiso"
    );
  }


  return datos;
}


// =====================================================
// CREAR PERMISO
// =====================================================

export async function crearPermiso(
  permiso: CrearPermiso
) {

  const token = await obtenerToken();

  if (!token) {
    throw new Error(
      "No existe una sesión activa"
    );
  }


  const respuesta = await fetch(
    `${API_URL}/permisos/`,
    {
      method: "POST",

      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },

      body: JSON.stringify(permiso)
    }
  );


  const datos = await respuesta.json();


  if (!respuesta.ok) {

    throw new Error(
      datos.detail ||
      "No fue posible crear el permiso"
    );
  }


  return datos;
}


// =====================================================
// ACTUALIZAR PERMISO
// =====================================================

export async function actualizarPermiso(
  permisoId: number,
  permiso: ActualizarPermiso
) {

  const token = await obtenerToken();

  if (!token) {
    throw new Error(
      "No existe una sesión activa"
    );
  }


  const respuesta = await fetch(
    `${API_URL}/permisos/${permisoId}`,
    {
      method: "PUT",

      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },

      body: JSON.stringify(permiso)
    }
  );


  const datos = await respuesta.json();


  if (!respuesta.ok) {

    throw new Error(
      datos.detail ||
      "No fue posible actualizar el permiso"
    );
  }


  return datos;
}


// =====================================================
// ELIMINAR PERMISO
// =====================================================

export async function eliminarPermiso(
  permisoId: number
) {

  const token = await obtenerToken();

  if (!token) {
    throw new Error(
      "No existe una sesión activa"
    );
  }


  const respuesta = await fetch(
    `${API_URL}/permisos/${permisoId}`,
    {
      method: "DELETE",

      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );


  if (!respuesta.ok) {

    let mensaje =
      "No fue posible eliminar el permiso";

    try {

      const datos =
        await respuesta.json();

      mensaje =
        datos.detail || mensaje;

    } catch {
      // respuesta sin JSON
    }

    throw new Error(mensaje);
  }


  return true;
}