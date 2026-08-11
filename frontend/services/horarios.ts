import { obtenerToken } from "./auth";
import { API_URL } from "./api";


export type Horario = {
  id: number;
  nombre: string;
  hora_entrada: string;
  hora_salida: string;
  tolerancia_minutos: number;
};


export type HorarioDatos = {
  nombre: string;
  hora_entrada: string;
  hora_salida: string;
  tolerancia_minutos: number;
};


// =====================================================
// LISTAR HORARIOS
// =====================================================

export async function obtenerHorarios(): Promise<Horario[]> {

  const token = await obtenerToken();

  if (!token) {
    throw new Error("No existe una sesión activa");
  }

  const respuesta = await fetch(
    `${API_URL}/horarios/`,
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
      "No fue posible obtener los horarios"
    );
  }

  return datos;
}


// =====================================================
// OBTENER HORARIO POR ID
// =====================================================

export async function obtenerHorarioPorId(
  horarioId: number
): Promise<Horario> {

  const token = await obtenerToken();

  if (!token) {
    throw new Error("No existe una sesión activa");
  }

  const respuesta = await fetch(
    `${API_URL}/horarios/${horarioId}`,
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
      "No fue posible obtener el horario"
    );
  }

  return datos;
}


// =====================================================
// CREAR HORARIO
// =====================================================

export async function crearHorario(
  horario: HorarioDatos
) {

  const token = await obtenerToken();

  if (!token) {
    throw new Error("No existe una sesión activa");
  }

  const respuesta = await fetch(
    `${API_URL}/horarios/`,
    {
      method: "POST",

      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },

      body: JSON.stringify(horario)
    }
  );

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(
      datos.detail ||
      "No fue posible crear el horario"
    );
  }

  return datos;
}


// =====================================================
// ACTUALIZAR HORARIO
// =====================================================

export async function actualizarHorario(
  horarioId: number,
  horario: HorarioDatos
) {

  const token = await obtenerToken();

  if (!token) {
    throw new Error("No existe una sesión activa");
  }

  const respuesta = await fetch(
    `${API_URL}/horarios/${horarioId}`,
    {
      method: "PUT",

      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },

      body: JSON.stringify(horario)
    }
  );

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(
      datos.detail ||
      "No fue posible actualizar el horario"
    );
  }

  return datos;
}


// =====================================================
// ELIMINAR HORARIO
// =====================================================

export async function eliminarHorario(
  horarioId: number
) {

  const token = await obtenerToken();

  if (!token) {
    throw new Error("No existe una sesión activa");
  }

  const respuesta = await fetch(
    `${API_URL}/horarios/${horarioId}`,
    {
      method: "DELETE",

      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(
      datos.detail ||
      "No fue posible eliminar el horario"
    );
  }

  return datos;
}