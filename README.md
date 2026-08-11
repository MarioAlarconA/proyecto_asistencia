# Sistema de Control de Asistencia con Reconocimiento Facial

Proyecto final desarrollado como una aplicación móvil para el control de asistencia de usuarios mediante reconocimiento facial.

El sistema permite administrar usuarios, horarios, permisos, vacaciones y registros de asistencia. La identificación facial se realiza utilizando DeepFace desde un backend desarrollado con FastAPI, mientras que la aplicación móvil fue desarrollada con React Native y Expo.

---

## Características principales

### Autenticación

- Inicio de sesión mediante usuario y contraseña.
- Autenticación utilizando JWT.
- Sesiones persistentes en la aplicación móvil.
- Control de acceso mediante roles:
  - Administrador.
  - Usuario.
- Cierre de sesión.

### Gestión de usuarios

El administrador puede:

- Registrar usuarios.
- Capturar una fotografía facial desde el teléfono.
- Editar información de usuarios.
- Consultar usuarios registrados.
- Eliminar usuarios.
- Asignar área.
- Asignar horario.
- Asignar rol.
- Activar o desactivar usuarios.

### Reconocimiento facial

El sistema utiliza DeepFace para comparar el rostro capturado desde el dispositivo móvil contra los rostros registrados en la base de datos.

El reconocimiento se utiliza para:

- Registrar entrada.
- Registrar salida.
- Identificar automáticamente al usuario.
- Evitar que el usuario tenga que escribir su ID durante el registro de asistencia.

### Asistencias

El sistema permite:

- Registrar entrada mediante reconocimiento facial.
- Registrar salida mediante reconocimiento facial.
- Registrar automáticamente la fecha y hora.
- Determinar si una asistencia corresponde a:
  - Presente.
  - Retardo.
- Consultar asistencias del día.
- Consultar historial por usuario.
- Consultar historial por área.
- Consultar historial personal.

Los historiales permiten filtrar por:

- Semana.
- Mes.
- Año.

### Horarios

El administrador puede:

- Crear horarios.
- Consultar horarios.
- Editar horarios.
- Eliminar horarios.
- Configurar hora de entrada.
- Configurar hora de salida.
- Configurar minutos de tolerancia.

La tolerancia es utilizada para determinar automáticamente si el usuario llegó a tiempo o presentó un retardo.

### Permisos y vacaciones

Los usuarios pueden:

- Solicitar permisos.
- Solicitar vacaciones.
- Consultar sus solicitudes.
- Editar solicitudes pendientes.
- Eliminar solicitudes pendientes.
- Consultar si una solicitud fue aprobada o rechazada.

Los administradores pueden:

- Consultar todas las solicitudes.
- Aprobar solicitudes.
- Rechazar solicitudes.
- Eliminar solicitudes.

---

# Tecnologías utilizadas

## Backend

- Python
- FastAPI
- Uvicorn
- SQLAlchemy
- PostgreSQL
- DeepFace
- VGG-Face
- OpenCV
- TensorFlow
- PyJWT
- pwdlib
- python-multipart

## Frontend

- React Native
- Expo
- Expo Router
- TypeScript
- NativeWind
- Expo Camera
- Expo Secure Store

---

# Arquitectura general

El proyecto se encuentra dividido en dos aplicaciones principales:

```text
proyecto_final/
│
├── backend/
│
└── frontend/
```

El frontend móvil se comunica mediante peticiones HTTP con una API REST desarrollada con FastAPI.

```text
Aplicación móvil
      │
      │ HTTP / JSON / Multipart
      ▼
    FastAPI
      │
      ├── Autenticación JWT
      ├── Gestión de usuarios
      ├── Asistencias
      ├── Horarios
      ├── Permisos
      └── DeepFace
              │
              ▼
          PostgreSQL
```

---

# Estructura del proyecto

## Backend

```text
backend/
│
├── app/
│   ├── main.py
│   │
│   ├── db/
│   │
│   ├── models/
│   │
│   ├── routes/
│   │
│   ├── schemas/
│   │
│   └── services/
│
├── fotos_subidas/
│   ├── jetas/
│   └── temporales/
│
├── requirements.txt
├── .env
└── venv/
```

La carpeta:

```text
fotos_subidas/jetas/
```

almacena las fotografías utilizadas como referencia para el reconocimiento facial.

La carpeta:

```text
fotos_subidas/temporales/
```

se utiliza temporalmente durante la identificación facial.

Las imágenes temporales se eliminan después de procesar la solicitud.

---

## Frontend

```text
frontend/
│
├── app/
│   ├── admin/
│   ├── usuario/
│   ├── _layout.tsx
│   └── index.tsx
│
├── components/
│   └── AsistenciaFacial.tsx
│
├── context/
│   └── AuthContext.tsx
│
├── services/
│   ├── api.ts
│   ├── auth.ts
│   ├── usuarios.ts
│   ├── horarios.ts
│   ├── permisos.ts
│   └── asistencias.ts
│
├── global.css
├── tailwind.config.js
├── metro.config.js
├── babel.config.js
└── package.json
```

---

# Base de datos

El sistema utiliza PostgreSQL.

La base de datos utilizada durante el desarrollo se llama:

```text
asistencia_db
```

## Tablas principales

### usuarios

Almacena la información de las personas registradas.

Campos principales:

```text
id
nombre
apellido
username
password_hash
rol
activo
area_id
horario_id
foto_rostro
```

La contraseña no se almacena en texto plano.

---

### areas

Permite relacionar usuarios con un área determinada.

Campos principales:

```text
id
nombre
```

---

### horarios

Almacena los horarios de trabajo.

Campos principales:

```text
id
nombre
hora_entrada
hora_salida
tolerancia_minutos
```

---

### asistencias

Almacena los registros diarios de asistencia.

Campos principales:

```text
id
usuario_id
fecha
hora_entrada
hora_salida
estado
metodo
```

Ejemplo:

```text
fecha: 2026-08-11
hora_entrada: 08:05:00
hora_salida: 17:02:00
estado: presente
metodo: facial
```

---

### permisos

Almacena permisos y vacaciones solicitados por los usuarios.

Campos principales:

```text
id
usuario_id
tipo
fecha_inicio
fecha_fin
motivo
estado
```

Los estados utilizados son:

```text
pendiente
aprobado
rechazado
```

---

# Instalación del backend

## 1. Entrar a la carpeta

Desde PowerShell:

```powershell
cd backend
```

---

## 2. Crear entorno virtual

```powershell
python -m venv venv
```

---

## 3. Activar entorno virtual

En PowerShell:

```powershell
.\venv\Scripts\Activate.ps1
```

En CMD:

```cmd
venv\Scripts\activate
```

---

## 4. Instalar dependencias

```powershell
pip install -r requirements.txt
```

La primera ejecución de DeepFace puede tardar más tiempo debido a la carga de TensorFlow y del modelo de reconocimiento facial.

---

# Configuración de PostgreSQL

Se debe tener instalado PostgreSQL y crear una base de datos.

Ejemplo:

```sql
CREATE DATABASE asistencia_db;
```

Posteriormente se debe configurar la conexión dentro del archivo:

```text
backend/.env
```

---

# Variables de entorno

Crear:

```text
backend/.env
```

Ejemplo:

```env
DATABASE_URL=postgresql://USUARIO:CONTRASEÑA@localhost:5432/asistencia_db

SECRET_KEY=CAMBIAR_ESTA_CLAVE_POR_UNA_CLAVE_SEGURA
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

Ejemplo únicamente para desarrollo local:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/asistencia_db
```

La contraseña y la configuración deben modificarse de acuerdo con la instalación local de PostgreSQL.

> El archivo `.env` no debe subirse al repositorio.

---

# Ejecutar el backend

Dentro de:

```text
backend/
```

con el entorno virtual activo:

```powershell
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

El backend quedará disponible en:

```text
http://127.0.0.1:8000
```

Documentación Swagger:

```text
http://127.0.0.1:8000/docs
```

Health check:

```text
http://127.0.0.1:8000/health
```

Cuando se utiliza un teléfono físico, el backend debe ejecutarse con:

```text
--host 0.0.0.0
```

para permitir conexiones desde otros dispositivos de la misma red.

---

# Instalación del frontend

Entrar a:

```powershell
cd frontend
```

Instalar dependencias:

```powershell
npm install
```

---

# Configurar dirección del backend

El frontend utiliza:

```text
frontend/services/api.ts
```

La dirección debe corresponder a la IP local de la computadora donde se está ejecutando FastAPI.

Ejemplo:

```ts
export const API_URL =
  "http://192.168.1.10:8000";
```

Para obtener la IP en Windows:

```powershell
ipconfig
```

Buscar:

```text
Dirección IPv4
```

Por ejemplo:

```text
192.168.1.10
```

Entonces:

```ts
export const API_URL =
  "http://192.168.1.10:8000";
```

El teléfono y la computadora deben encontrarse conectados a la misma red local.

No debe utilizarse:

```text
127.0.0.1
```

desde un teléfono físico, ya que esa dirección apuntaría al propio teléfono y no a la computadora.

---

# Ejecutar aplicación móvil

Dentro de:

```text
frontend/
```

ejecutar:

```powershell
npx expo start --lan
```

Si existen problemas de caché:

```powershell
npx expo start --lan --clear
```

Después:

1. Abrir Expo Go en el dispositivo móvil.
2. Escanear el código QR.
3. Esperar a que cargue la aplicación.

---

# Permisos de cámara

El sistema utiliza:

```text
expo-camera
```

para capturar:

- Fotografía de registro del usuario.
- Fotografía de entrada.
- Fotografía de salida.

La primera vez que se utiliza la cámara, el sistema operativo solicitará autorización.

Es necesario aceptar el permiso para utilizar las funciones de reconocimiento facial.

---

# Flujo de reconocimiento facial

## Registro inicial

El administrador registra al usuario:

```text
Administrador
      ↓
Usuarios
      ↓
Registrar usuario
      ↓
Capturar rostro
      ↓
Enviar datos
      ↓
FastAPI
      ↓
Guardar usuario
      ↓
Guardar fotografía facial
```

---

## Entrada

Cuando se registra una entrada:

```text
Usuario
   ↓
Registrar asistencia
   ↓
Registrar entrada
   ↓
Cámara frontal
   ↓
Fotografía
   ↓
FastAPI
   ↓
DeepFace
   ↓
Comparación contra rostros registrados
   ↓
Usuario identificado
   ↓
Registro de asistencia
```

DeepFace calcula la similitud entre el rostro capturado y los rostros registrados.

El sistema selecciona la coincidencia con menor distancia siempre que cumpla con el umbral configurado.

---

# Registro de entrada y retardo

Después de identificar al usuario, el backend consulta su horario asignado.

Se consideran:

```text
hora de entrada
+
minutos de tolerancia
```

Ejemplo:

```text
Hora de entrada: 08:00
Tolerancia: 10 minutos
```

Un registro dentro del periodo permitido se registra como:

```text
presente
```

Mientras que un registro después de la tolerancia se registra como:

```text
retardo
```

---

# Registro de salida

Al seleccionar:

```text
Registrar salida
```

el sistema realiza nuevamente reconocimiento facial.

Después de identificar al usuario, busca la asistencia correspondiente al día actual y agrega:

```text
hora_salida
```

Por lo tanto, entrada y salida permanecen dentro del mismo registro de asistencia.

---

# API REST

## Autenticación

```text
POST /auth/login
```

---

## Usuarios

```text
POST   /usuarios/
GET    /usuarios/
GET    /usuarios/{usuario_id}
PUT    /usuarios/{usuario_id}
DELETE /usuarios/{usuario_id}
```

Registro completo con fotografía:

```text
POST /usuarios/registro-completo
```

Registro o actualización de rostro:

```text
POST /usuarios/{usuario_id}/rostro
```

---

## Horarios

```text
POST   /horarios/
GET    /horarios/
GET    /horarios/{horario_id}
PUT    /horarios/{horario_id}
DELETE /horarios/{horario_id}
```

---

## Permisos

Crear solicitud:

```text
POST /permisos/
```

Solicitudes del usuario autenticado:

```text
GET /permisos/mis-permisos
```

Todas las solicitudes para administrador:

```text
GET /permisos/
```

Consultar una:

```text
GET /permisos/{permiso_id}
```

Editar:

```text
PUT /permisos/{permiso_id}
```

Eliminar:

```text
DELETE /permisos/{permiso_id}
```

---

## Asistencias

Registro manual disponible para administrador:

```text
POST /asistencias/entrada
POST /asistencias/salida
```

Reconocimiento facial:

```text
POST /asistencias/entrada-facial
POST /asistencias/salida-facial
```

Asistencias del día:

```text
GET /asistencias/hoy
```

Historial por usuario:

```text
GET /asistencias/usuario/{usuario_id}
```

Historial por área:

```text
GET /asistencias/area/{area_id}
```

Historial del usuario autenticado:

```text
GET /asistencias/mis-asistencias
```

Los historiales permiten utilizar:

```text
periodo=semana
periodo=mes
periodo=año
```

Ejemplo:

```text
GET /asistencias/mis-asistencias?periodo=mes
```

---

# Seguridad

El proyecto implementa diferentes medidas de seguridad.

## Contraseñas

Las contraseñas se almacenan utilizando hash y nunca en texto plano.

## JWT

Los endpoints protegidos requieren:

```text
Authorization: Bearer TOKEN
```

## Roles

Existen dos roles:

```text
administrador
usuario
```

Los endpoints administrativos verifican que el usuario autenticado tenga rol de administrador.

Un usuario normal no puede acceder a operaciones administrativas.

## Fotografías

Las fotografías faciales no deben almacenarse dentro del repositorio público.

Por esta razón las carpetas de imágenes deben incluirse en `.gitignore`.

---

# Pantallas de la aplicación

## Administrador

El panel del administrador incluye:

```text
Usuarios
Asistencias
Horarios
Permisos
Cerrar sesión
```

### Usuarios

Permite:

```text
Registrar
Consultar
Editar
Eliminar
Capturar fotografía facial
```

### Asistencias

Permite:

```text
Tomar asistencia
Ver asistencias del día
Consultar por usuario
Consultar por área
Filtrar por periodo
```

### Horarios

Permite:

```text
Crear
Consultar
Editar
Eliminar
```

### Permisos

Permite:

```text
Consultar solicitudes
Aprobar
Rechazar
Eliminar
```

---

## Usuario

El panel del usuario incluye:

```text
Registrar asistencia
Mis asistencias
Mis permisos
Cerrar sesión
```

### Registrar asistencia

Permite:

```text
Entrada facial
Salida facial
```

### Mis asistencias

Permite consultar:

```text
Semana
Mes
Año
```

### Mis permisos

Permite:

```text
Solicitar permiso
Solicitar vacaciones
Editar solicitud pendiente
Eliminar solicitud pendiente
Consultar estado
```

---

# Prueba recomendada del sistema

Para probar el flujo completo:

## Administrador

```text
1. Iniciar sesión.
2. Crear un horario.
3. Registrar un usuario.
4. Capturar su rostro.
5. Consultar el usuario.
6. Cerrar sesión.
```

## Usuario

```text
1. Iniciar sesión.
2. Registrar entrada facial.
3. Consultar Mis asistencias.
4. Solicitar un permiso.
5. Cerrar sesión.
```

## Administrador

```text
1. Iniciar sesión.
2. Consultar Permisos.
3. Aprobar o rechazar la solicitud.
4. Consultar asistencias del día.
5. Consultar historial por usuario.
6. Cerrar sesión.
```

## Usuario

```text
1. Iniciar sesión.
2. Consultar el estado del permiso.
3. Registrar salida facial.
4. Consultar entrada y salida.
```

---

# Consideraciones para reconocimiento facial

Para obtener mejores resultados:

- Mantener el rostro de frente.
- Utilizar buena iluminación.
- Evitar luz intensa detrás de la persona.
- Evitar cubrir ojos o gran parte del rostro.
- Mantener una distancia adecuada de la cámara.
- Utilizar fotografías de registro claras.

---

# Ejecución rápida

## Backend

```powershell
cd backend

.\venv\Scripts\Activate.ps1

uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

## Frontend

En otra terminal:

```powershell
cd frontend

npx expo start --lan --clear
```

Después abrir la aplicación desde Expo Go.

---

# Problemas comunes

## El teléfono no conecta con FastAPI

Comprobar:

```text
1. Computadora y teléfono en la misma red.
2. FastAPI ejecutándose con --host 0.0.0.0.
3. API_URL utilizando la IP actual de la computadora.
4. Puerto 8000 disponible.
```

---

## La IP cambió

Ejecutar:

```powershell
ipconfig
```

Actualizar:

```text
frontend/services/api.ts
```

y reiniciar Expo.

---

## Error de autenticación

Verificar que exista un token almacenado y que se envíe:

```text
Authorization: Bearer TOKEN
```

---

## DeepFace tarda en iniciar

La primera ejecución puede tardar debido a la inicialización de TensorFlow y a la carga del modelo facial.

Las siguientes peticiones normalmente reutilizan componentes ya cargados.

---

## Rostro no reconocido

Verificar:

```text
Iluminación
Posición del rostro
Calidad de la fotografía
Distancia de la cámara
Fotografía facial registrada
```

---

# Privacidad

Las fotografías utilizadas para reconocimiento facial constituyen información sensible.

En un entorno real se recomienda:

- Solicitar consentimiento de los usuarios.
- Restringir acceso a las fotografías.
- Aplicar políticas de conservación.
- Proteger el almacenamiento.
- Evitar publicar fotografías reales en repositorios.
- Implementar controles adicionales de privacidad y seguridad.

---

# Estado del proyecto

Actualmente se encuentran implementados:

- Autenticación JWT.
- Roles.
- CRUD de usuarios.
- Registro de usuario con fotografía.
- Reconocimiento facial.
- Entrada facial.
- Salida facial.
- CRUD de horarios.
- Gestión de permisos y vacaciones.
- Historial de asistencias.
- Filtros por semana, mes y año.
- Historial por usuario.
- Historial por área.
- Aplicación móvil para administrador.
- Aplicación móvil para usuario.

---

# Autor

**Mario Alberto Alarcón Alcántara**

Proyecto académico de desarrollo de software.

---

# Licencia

Proyecto desarrollado con fines académicos y educativos.