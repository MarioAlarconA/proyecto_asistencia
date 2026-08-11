from datetime import date, datetime, timedelta
import os
import shutil
import uuid
from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
    UploadFile,
    File
)
from sqlalchemy.orm import Session
from app.db.connection import get_db
from app.models.asistencia import Asistencia
from app.models.usuario import Usuario
from app.models.permiso import Permiso
from app.schemas.asistencia import (
    AsistenciaCreate,
    AsistenciaUpdate,
    AsistenciaResponse
)
from app.services.dependencies import (
    obtener_usuario_actual,
    obtener_administrador
)
from app.services.reconocimiento import reconocer_usuario


router = APIRouter(
    prefix="/asistencias",
    tags=["Asistencias"]
)

CARPETA_TEMPORALES = os.path.join(
    "fotos_subidas",
    "temporales"
)


def guardar_imagen_temporal(
    archivo: UploadFile
) -> str:

    tipos_permitidos = [
        "image/jpeg",
        "image/jpg",
        "image/png"
    ]

    if archivo.content_type not in tipos_permitidos:
        raise HTTPException(
            status_code=400,
            detail="La imagen debe ser JPG, JPEG o PNG"
        )

    os.makedirs(
        CARPETA_TEMPORALES,
        exist_ok=True
    )

    extension = os.path.splitext(
        archivo.filename or ""
    )[1].lower()

    if extension not in [".jpg", ".jpeg", ".png"]:
        raise HTTPException(
            status_code=400,
            detail="Extensión de imagen no permitida"
        )

    nombre_archivo = (
        f"{uuid.uuid4().hex}{extension}"
    )

    ruta_archivo = os.path.join(
        CARPETA_TEMPORALES,
        nombre_archivo
    )

    with open(ruta_archivo, "wb") as buffer:
        shutil.copyfileobj(
            archivo.file,
            buffer
        )

    return ruta_archivo

def calcular_estado_asistencia(
    usuario: Usuario,
    hora_actual
) -> str:

    if not usuario.horario:
        return "presente"

    horario = usuario.horario

    ahora = datetime.combine(
        date.today(),
        hora_actual
    )

    entrada_programada = datetime.combine(
        date.today(),
        horario.hora_entrada
    )

    limite_tolerancia = (
        entrada_programada
        + timedelta(
            minutes=horario.tolerancia_minutos
        )
    )

    if ahora <= limite_tolerancia:
        return "presente"

    return "retardo"


def obtener_permiso_aprobado(
    usuario_id: int,
    fecha_consulta: date,
    db: Session
):

    permiso = (
        db.query(Permiso)
        .filter(
            Permiso.usuario_id == usuario_id,
            Permiso.estado == "aprobado",
            Permiso.fecha_inicio <= fecha_consulta,
            Permiso.fecha_fin >= fecha_consulta
        )
        .first()
    )

    return permiso


@router.post(
    "/",
    response_model=AsistenciaResponse,
    status_code=status.HTTP_201_CREATED
)
def registrar_asistencia(
    asistencia_data: AsistenciaCreate,
    db: Session = Depends(get_db),
    administrador: Usuario = Depends(obtener_administrador)
):

    usuario = (
        db.query(Usuario)
        .filter(
            Usuario.id == asistencia_data.usuario_id
        )
        .first()
    )

    if not usuario:
        raise HTTPException(
            status_code=404,
            detail="Usuario no encontrado"
        )

    asistencia = Asistencia(
        usuario_id=asistencia_data.usuario_id,
        fecha=asistencia_data.fecha,
        hora_entrada=asistencia_data.hora_entrada,
        hora_salida=asistencia_data.hora_salida,
        estado=asistencia_data.estado,
        metodo=asistencia_data.metodo
    )

    db.add(asistencia)
    db.commit()
    db.refresh(asistencia)

    return asistencia



@router.post(
    "/entrada",
    response_model=AsistenciaResponse,
    status_code=status.HTTP_201_CREATED
)
def registrar_entrada(
    usuario_id: int,
    db: Session = Depends(get_db),
    administrador: Usuario = Depends(obtener_administrador)
):

    usuario = (
        db.query(Usuario)
        .filter(
            Usuario.id == usuario_id
        )
        .first()
    )

    if not usuario:
        raise HTTPException(
            status_code=404,
            detail="Usuario no encontrado"
        )

    ahora = datetime.now()

    fecha_hoy = ahora.date()
    hora_actual = ahora.time()

    asistencia_existente = (
        db.query(Asistencia)
        .filter(
            Asistencia.usuario_id == usuario_id,
            Asistencia.fecha == fecha_hoy,
            Asistencia.hora_entrada.isnot(None),
            Asistencia.hora_salida.is_(None)
        )
        .first()
    )

    if asistencia_existente:
        raise HTTPException(
            status_code=400,
            detail="El usuario ya tiene una entrada registrada hoy"
        )

    estado_asistencia = calcular_estado_asistencia(
        usuario=usuario,
        hora_actual=hora_actual)

    asistencia = Asistencia(
        usuario_id=usuario_id,
        fecha=fecha_hoy,
        hora_entrada=hora_actual,
        hora_salida=None,
        estado=estado_asistencia,
        metodo="manual"
    )

    db.add(asistencia)
    db.commit()
    db.refresh(asistencia)

    return asistencia



@router.post(
    "/salida",
    response_model=AsistenciaResponse
)
def registrar_salida(
    usuario_id: int,
    db: Session = Depends(get_db),
    administrador: Usuario = Depends(obtener_administrador)
):

    usuario = (
        db.query(Usuario)
        .filter(
            Usuario.id == usuario_id
        )
        .first()
    )

    if not usuario:
        raise HTTPException(
            status_code=404,
            detail="Usuario no encontrado"
        )

    ahora = datetime.now()

    asistencia = (
        db.query(Asistencia)
        .filter(
            Asistencia.usuario_id == usuario_id,
            Asistencia.fecha == ahora.date(),
            Asistencia.hora_entrada.isnot(None),
            Asistencia.hora_salida.is_(None)
        )
        .first()
    )

    if not asistencia:
        raise HTTPException(
            status_code=400,
            detail="No existe una entrada abierta para este usuario hoy"
        )

    asistencia.hora_salida = ahora.time()

    db.commit()
    db.refresh(asistencia)

    return asistencia


@router.post(
    "/entrada-facial",
    status_code=status.HTTP_201_CREATED
)
def registrar_entrada_facial(
    archivo: UploadFile = File(...),
    db: Session = Depends(get_db)
):

    ruta_temporal = None

    try:

        ruta_temporal = guardar_imagen_temporal(
            archivo
        )

        resultado = reconocer_usuario(
            imagen_prueba=ruta_temporal,
            db=db
        )

        if not resultado:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Rostro no reconocido"
            )

        usuario = resultado["usuario"]

        ahora = datetime.now()
        fecha_hoy = ahora.date()
        hora_actual = ahora.time()

        asistencia_existente = (
            db.query(Asistencia)
            .filter(
                Asistencia.usuario_id == usuario.id,
                Asistencia.fecha == fecha_hoy
            )
            .first()
        )

        if asistencia_existente:

            if asistencia_existente.hora_salida is None:
                raise HTTPException(
                    status_code=400,
                    detail=(
                        "El usuario ya tiene una "
                        "entrada registrada hoy"
                    )
                )

            raise HTTPException(
                status_code=400,
                detail=(
                    "El usuario ya completó "
                    "su asistencia del día"
                )
            )

        estado_asistencia = calcular_estado_asistencia(
            usuario=usuario,
            hora_actual=hora_actual)

        nueva_asistencia = Asistencia(
            usuario_id=usuario.id,
            fecha=fecha_hoy,
            hora_entrada=hora_actual,
            hora_salida=None,
            estado=estado_asistencia,
            metodo="facial"
        )

        db.add(nueva_asistencia)
        db.commit()
        db.refresh(nueva_asistencia)

        return {
            "mensaje": "Entrada registrada correctamente",
            "usuario": {
                "id": usuario.id,
                "nombre": usuario.nombre,
                "apellido": usuario.apellido
            },
            "reconocimiento": {
                "distancia": resultado["distancia"],
                "umbral": resultado["umbral"]
            },
            "asistencia": {
                "id": nueva_asistencia.id,
                "fecha": str(
                    nueva_asistencia.fecha
                ),
                "hora_entrada": str(
                    nueva_asistencia.hora_entrada
                ),
                "hora_salida": None,
                "estado": nueva_asistencia.estado,
                "metodo": nueva_asistencia.metodo
            }
        }

    finally:
        if (
            ruta_temporal
            and os.path.exists(ruta_temporal)
        ):
            os.remove(ruta_temporal)


@router.post(
    "/salida-facial",
    status_code=status.HTTP_200_OK
)
def registrar_salida_facial(
    archivo: UploadFile = File(...),
    db: Session = Depends(get_db)
):

    ruta_temporal = None

    try:

        ruta_temporal = guardar_imagen_temporal(
            archivo
        )

        resultado = reconocer_usuario(
            imagen_prueba=ruta_temporal,
            db=db
        )

        if not resultado:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Rostro no reconocido"
            )

        usuario = resultado["usuario"]

        ahora = datetime.now()
        fecha_hoy = ahora.date()
        hora_actual = ahora.time()

        asistencia = (
            db.query(Asistencia)
            .filter(
                Asistencia.usuario_id == usuario.id,
                Asistencia.fecha == fecha_hoy,
                Asistencia.hora_entrada.isnot(None),
                Asistencia.hora_salida.is_(None)
            )
            .order_by(
                Asistencia.id.desc()
            )
            .first()
        )

        if not asistencia:
            raise HTTPException(
                status_code=400,
                detail=(
                    "No existe una entrada abierta "
                    "para este usuario hoy"
                )
            )

        asistencia.hora_salida = hora_actual

        db.commit()
        db.refresh(asistencia)

        return {
            "mensaje": "Salida registrada correctamente",
            "usuario": {
                "id": usuario.id,
                "nombre": usuario.nombre,
                "apellido": usuario.apellido
            },
            "reconocimiento": {
                "distancia": resultado["distancia"],
                "umbral": resultado["umbral"]
            },
            "asistencia": {
                "id": asistencia.id,
                "fecha": str(asistencia.fecha),
                "hora_entrada": str(
                    asistencia.hora_entrada
                ),
                "hora_salida": str(
                    asistencia.hora_salida
                ),
                "estado": asistencia.estado,
                "metodo": asistencia.metodo
            }
        }

    except HTTPException:
        raise

    except Exception as e:

        db.rollback()

        print(
            "Error registrando salida facial:",
            e
        )

        raise HTTPException(
            status_code=500,
            detail="Error al registrar la salida facial"
        )

    finally:
        if (
            ruta_temporal
            and os.path.exists(ruta_temporal)
        ):
            os.remove(ruta_temporal)


@router.get(
    "/",
    response_model=list[AsistenciaResponse]
)
def obtener_asistencias(
    db: Session = Depends(get_db),
    administrador: Usuario = Depends(obtener_administrador)
):

    asistencias = (
        db.query(Asistencia)
        .order_by(
            Asistencia.fecha.desc()
        )
        .all()
    )

    return asistencias


@router.get(
    "/usuario/{usuario_id}",
    response_model=list[AsistenciaResponse]
)
def historial_usuario(
    usuario_id: int,
    periodo: str | None = None,
    db: Session = Depends(get_db),
    administrador: Usuario = Depends(obtener_administrador)
):

    usuario = (
        db.query(Usuario)
        .filter(
            Usuario.id == usuario_id
        )
        .first()
    )

    if not usuario:
        raise HTTPException(
            status_code=404,
            detail="Usuario no encontrado"
        )

    consulta = (
        db.query(Asistencia)
        .filter(
            Asistencia.usuario_id == usuario_id
        )
    )

    hoy = date.today()

    if periodo == "semana":

        inicio = hoy - timedelta(
            days=hoy.weekday()
        )

        fin = inicio + timedelta(
            days=6
        )

        consulta = consulta.filter(
            Asistencia.fecha >= inicio,
            Asistencia.fecha <= fin
        )

    elif periodo == "mes":

        inicio = hoy.replace(
            day=1
        )

        if hoy.month == 12:

            fin = hoy.replace(
                year=hoy.year + 1,
                month=1,
                day=1
            ) - timedelta(days=1)

        else:

            fin = hoy.replace(
                month=hoy.month + 1,
                day=1
            ) - timedelta(days=1)

        consulta = consulta.filter(
            Asistencia.fecha >= inicio,
            Asistencia.fecha <= fin
        )

    elif periodo == "año":

        inicio = date(
            hoy.year,
            1,
            1
        )

        fin = date(
            hoy.year,
            12,
            31
        )

        consulta = consulta.filter(
            Asistencia.fecha >= inicio,
            Asistencia.fecha <= fin
        )

    elif periodo is not None:

        raise HTTPException(
            status_code=400,
            detail="El periodo debe ser semana, mes o año"
        )

    return (
        consulta
        .order_by(
            Asistencia.fecha.desc()
        )
        .all()
    )



@router.get(
    "/area/{area_id}",
    response_model=list[AsistenciaResponse]
)
def historial_area(
    area_id: int,
    periodo: str | None = None,
    db: Session = Depends(get_db),
    administrador: Usuario = Depends(obtener_administrador)
):

    usuarios_area = (
        db.query(Usuario.id)
        .filter(
            Usuario.area_id == area_id
        )
        .subquery()
    )

    consulta = (
        db.query(Asistencia)
        .filter(
            Asistencia.usuario_id.in_(
                usuarios_area
            )
        )
    )

    hoy = date.today()

    if periodo == "semana":

        inicio = hoy - timedelta(
            days=hoy.weekday()
        )

        fin = inicio + timedelta(
            days=6
        )

        consulta = consulta.filter(
            Asistencia.fecha >= inicio,
            Asistencia.fecha <= fin
        )

    elif periodo == "mes":

        inicio = hoy.replace(
            day=1
        )

        if hoy.month == 12:

            fin = hoy.replace(
                year=hoy.year + 1,
                month=1,
                day=1
            ) - timedelta(days=1)

        else:

            fin = hoy.replace(
                month=hoy.month + 1,
                day=1
            ) - timedelta(days=1)

        consulta = consulta.filter(
            Asistencia.fecha >= inicio,
            Asistencia.fecha <= fin
        )

    elif periodo == "año":

        inicio = date(
            hoy.year,
            1,
            1
        )

        fin = date(
            hoy.year,
            12,
            31
        )

        consulta = consulta.filter(
            Asistencia.fecha >= inicio,
            Asistencia.fecha <= fin
        )

    elif periodo is not None:

        raise HTTPException(
            status_code=400,
            detail="El periodo debe ser semana, mes o año"
        )

    return (
        consulta
        .order_by(
            Asistencia.fecha.desc()
        )
        .all()
    )

@router.post(
    "/generar-ausencias",
    status_code=status.HTTP_200_OK
)
def generar_ausencias(
    fecha_objetivo: date,
    db: Session = Depends(get_db),
    administrador: Usuario = Depends(obtener_administrador)
):

    hoy = date.today()

    if fecha_objetivo >= hoy:
        raise HTTPException(
            status_code=400,
            detail=(
                "Solo se pueden generar ausencias "
                "de fechas anteriores al día actual"
            )
        )

    usuarios = (
        db.query(Usuario)
        .filter(
            Usuario.activo == True
        )
        .all()
    )

    faltas_generadas = 0
    permisos_generados = 0
    vacaciones_generadas = 0
    omitidos = 0

    resultados = []

    for usuario in usuarios:

        asistencia_existente = (
            db.query(Asistencia)
            .filter(
                Asistencia.usuario_id == usuario.id,
                Asistencia.fecha == fecha_objetivo
            )
            .first()
        )

        if asistencia_existente:
            omitidos += 1
            continue

        permiso = obtener_permiso_aprobado(
            usuario_id=usuario.id,
            fecha_consulta=fecha_objetivo,
            db=db
        )


        if permiso:

            tipo_permiso = permiso.tipo.strip().lower()

            if tipo_permiso == "vacaciones":
                estado = "vacaciones"
                vacaciones_generadas += 1
            else:
                estado = "permiso"
                permisos_generados += 1


        else:
            estado = "falta"
            faltas_generadas += 1

        asistencia = Asistencia(
            usuario_id=usuario.id,
            fecha=fecha_objetivo,
            hora_entrada=None,
            hora_salida=None,
            estado=estado,
            metodo="sistema"
        )

        db.add(asistencia)

        resultados.append({
            "usuario_id": usuario.id,
            "nombre": f"{usuario.nombre} {usuario.apellido}",
            "estado": estado
        })

    db.commit()

    return {
        "mensaje": "Ausencias generadas correctamente",
        "fecha": str(fecha_objetivo),
        "resumen": {
            "faltas": faltas_generadas,
            "permisos": permisos_generados,
            "vacaciones": vacaciones_generadas,
            "omitidos": omitidos
        },
        "resultados": resultados
    }

@router.get(
    "/mis-asistencias",
    response_model=list[AsistenciaResponse]
)
def obtener_mis_asistencias(
    periodo: str | None = None,
    db: Session = Depends(get_db),
    usuario: Usuario = Depends(obtener_usuario_actual)
):

    consulta = (
        db.query(Asistencia)
        .filter(
            Asistencia.usuario_id == usuario.id
        )
    )

    hoy = date.today()

    if periodo == "semana":

        inicio = hoy - timedelta(
            days=hoy.weekday()
        )

        fin = inicio + timedelta(
            days=6
        )

        consulta = consulta.filter(
            Asistencia.fecha >= inicio,
            Asistencia.fecha <= fin
        )

    elif periodo == "mes":

        inicio = hoy.replace(
            day=1
        )

        if hoy.month == 12:

            fin = hoy.replace(
                year=hoy.year + 1,
                month=1,
                day=1
            ) - timedelta(days=1)

        else:

            fin = hoy.replace(
                month=hoy.month + 1,
                day=1
            ) - timedelta(days=1)

        consulta = consulta.filter(
            Asistencia.fecha >= inicio,
            Asistencia.fecha <= fin
        )

    elif periodo == "año":

        inicio = date(
            hoy.year,
            1,
            1
        )

        fin = date(
            hoy.year,
            12,
            31
        )

        consulta = consulta.filter(
            Asistencia.fecha >= inicio,
            Asistencia.fecha <= fin
        )

    elif periodo is not None:

        raise HTTPException(
            status_code=400,
            detail=(
                "El periodo debe ser "
                "semana, mes o año"
            )
        )

    return (
        consulta
        .order_by(
            Asistencia.fecha.desc(),
            Asistencia.id.desc()
        )
        .all()
    )


@router.get(
    "/hoy",
    response_model=list[AsistenciaResponse]
)
def obtener_asistencias_hoy(
    db: Session = Depends(get_db),
    administrador: Usuario = Depends(obtener_administrador)
):

    fecha_hoy = date.today()

    asistencias = (
        db.query(Asistencia)
        .filter(
            Asistencia.fecha == fecha_hoy
        )
        .order_by(
            Asistencia.hora_entrada.asc(),
            Asistencia.id.asc()
        )
        .all()
    )

    return asistencias


@router.get(
    "/{asistencia_id}",
    response_model=AsistenciaResponse
)
def obtener_asistencia(
    asistencia_id: int,
    db: Session = Depends(get_db),
    administrador: Usuario = Depends(obtener_administrador)
):

    asistencia = (
        db.query(Asistencia)
        .filter(
            Asistencia.id == asistencia_id
        )
        .first()
    )

    if not asistencia:
        raise HTTPException(
            status_code=404,
            detail="Asistencia no encontrada"
        )

    return asistencia



@router.put(
    "/{asistencia_id}",
    response_model=AsistenciaResponse
)
def actualizar_asistencia(
    asistencia_id: int,
    asistencia_data: AsistenciaUpdate,
    db: Session = Depends(get_db),
    administrador: Usuario = Depends(obtener_administrador)
):

    asistencia = (
        db.query(Asistencia)
        .filter(
            Asistencia.id == asistencia_id
        )
        .first()
    )

    if not asistencia:
        raise HTTPException(
            status_code=404,
            detail="Asistencia no encontrada"
        )

    datos = asistencia_data.model_dump(
        exclude_unset=True
    )

    for campo, valor in datos.items():

        setattr(
            asistencia,
            campo,
            valor
        )

    db.commit()
    db.refresh(asistencia)

    return asistencia


@router.delete(
    "/{asistencia_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
def eliminar_asistencia(
    asistencia_id: int,
    db: Session = Depends(get_db),
    administrador: Usuario = Depends(obtener_administrador)
):

    asistencia = (
        db.query(Asistencia)
        .filter(
            Asistencia.id == asistencia_id
        )
        .first()
    )

    if not asistencia:
        raise HTTPException(
            status_code=404,
            detail="Asistencia no encontrada"
        )

    db.delete(asistencia)
    db.commit()

    return None