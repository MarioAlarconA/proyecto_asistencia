import { obtenerToken } from "./auth";
import { API_URL } from "./api";


export type PeriodoAsistencia =
  | "semana"
  | "mes"
  | "año";


export type Asistencia = {
  id: number;
  usuario_id: number;
  fecha: string;
  hora_entrada: string | null;
  hora_salida: string | null;
  estado: string;
  metodo: string;
};


// =====================================================
// FUNCIÓN AUXILIAR
// =====================================================

async function obtenerHeaders() {

  const token = await obtenerToken();

  if (!token) {
    throw new Error(
      "No existe una sesión activa"
    );
  }

  return {
    Authorization: `Bearer ${token}`
  };
}


// =====================================================
// MIS ASISTENCIAS - USUARIO
// =====================================================

export async function obtenerMisAsistencias(
  periodo: PeriodoAsistencia
): Promise<Asistencia[]> {

  const headers =
    await obtenerHeaders();


  const respuesta = await fetch(
    `${API_URL}/asistencias/mis-asistencias?periodo=${encodeURIComponent(periodo)}`,
    {
      method: "GET",
      headers
    }
  );


  const datos =
    await respuesta.json();


  if (!respuesta.ok) {

    throw new Error(
      datos.detail ||
      "No fue posible obtener las asistencias"
    );
  }


  return datos;
}


// =====================================================
// ASISTENCIAS DE HOY - ADMIN
// =====================================================

export async function obtenerAsistenciasHoy():
Promise<Asistencia[]> {

  const headers =
    await obtenerHeaders();


  const respuesta = await fetch(
    `${API_URL}/asistencias/hoy`,
    {
      method: "GET",
      headers
    }
  );


  const datos =
    await respuesta.json();


  if (!respuesta.ok) {

    throw new Error(
      datos.detail ||
      "No fue posible obtener las asistencias de hoy"
    );
  }


  return datos;
}


// =====================================================
// HISTORIAL POR USUARIO - ADMIN
// =====================================================

export async function obtenerAsistenciasUsuario(
  usuarioId: number,
  periodo: PeriodoAsistencia
): Promise<Asistencia[]> {

  const headers =
    await obtenerHeaders();


  const respuesta = await fetch(
    `${API_URL}/asistencias/usuario/${usuarioId}?periodo=${encodeURIComponent(periodo)}`,
    {
      method: "GET",
      headers
    }
  );


  const datos =
    await respuesta.json();


  if (!respuesta.ok) {

    throw new Error(
      datos.detail ||
      "No fue posible obtener el historial del usuario"
    );
  }


  return datos;
}


// =====================================================
// HISTORIAL POR ÁREA - ADMIN
// =====================================================

export async function obtenerAsistenciasArea(
  areaId: number,
  periodo: PeriodoAsistencia
): Promise<Asistencia[]> {

  const headers =
    await obtenerHeaders();


  const respuesta = await fetch(
    `${API_URL}/asistencias/area/${areaId}?periodo=${encodeURIComponent(periodo)}`,
    {
      method: "GET",
      headers
    }
  );


  const datos =
    await respuesta.json();


  if (!respuesta.ok) {

    throw new Error(
      datos.detail ||
      "No fue posible obtener el historial del área"
    );
  }


  return datos;
}

// =====================================================
// ENVIAR FOTO PARA RECONOCIMIENTO FACIAL
// =====================================================

async function enviarFotoFacial(
  endpoint: string,
  fotoUri: string
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
    "archivo",
    {
      uri: fotoUri,
      name: "rostro.jpg",
      type: "image/jpeg"
    } as any
  );


  const respuesta =
    await fetch(
      `${API_URL}${endpoint}`,
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
      "No fue posible registrar la asistencia"
    );
  }


  return datos;
}


// =====================================================
// ENTRADA FACIAL
// =====================================================

export async function registrarEntradaFacial(
  fotoUri: string
) {

  return enviarFotoFacial(
    "/asistencias/entrada-facial",
    fotoUri
  );
}


// =====================================================
// SALIDA FACIAL
// =====================================================

export async function registrarSalidaFacial(
  fotoUri: string
) {

  return enviarFotoFacial(
    "/asistencias/salida-facial",
    fotoUri
  );
}