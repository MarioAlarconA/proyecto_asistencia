from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from app.db.connection import get_db
from app.models.usuario import Usuario
from app.models.area import Area
from app.models.horario import Horario
from app.schemas.usuario import (
    UsuarioCreate,
    UsuarioUpdate,
    UsuarioResponse
)
from app.services.password import hash_password
from app.services.dependencies import obtener_administrador
import os
import shutil



router = APIRouter(
    prefix="/usuarios",
    tags=["Usuarios"]
)

@router.post(
    "/",
    response_model=UsuarioResponse,
    status_code=status.HTTP_201_CREATED
)
def crear_usuario(
    usuario_data: UsuarioCreate,
    db: Session = Depends(get_db),
    administrador: Usuario = Depends(obtener_administrador)
):
    usuario_existente = (
        db.query(Usuario)
        .filter(Usuario.username == usuario_data.username)
        .first()
    )
    if usuario_existente:
        raise HTTPException(
            status_code=400,
            detail="El username ya está registrado"
        )

    area = (
        db.query(Area)
        .filter(Area.id == usuario_data.area_id)
        .first()
    )
    if not area:
        raise HTTPException(
            status_code=404,
            detail="El área especificada no existe"
        )

    horario = (
        db.query(Horario)
        .filter(Horario.id == usuario_data.horario_id)
        .first()
    )
    if not horario:
        raise HTTPException(
            status_code=404,
            detail="El horario especificado no existe"
        )

    nuevo_usuario = Usuario(
        nombre=usuario_data.nombre,
        apellido=usuario_data.apellido,
        username=usuario_data.username,
        password_hash=hash_password(
            usuario_data.password
        ),
        rol=usuario_data.rol,
        area_id=usuario_data.area_id,
        horario_id=usuario_data.horario_id,
        activo=True
    )

    db.add(nuevo_usuario)
    db.commit()
    db.refresh(nuevo_usuario)
    return nuevo_usuario

@router.get(
    "/",
    response_model=list[UsuarioResponse]
)
def obtener_usuarios(
    db: Session = Depends(get_db),
    administrador: Usuario = Depends(obtener_administrador)
):
    usuarios = (
        db.query(Usuario)
        .order_by(Usuario.id)
        .all()
    )
    return usuarios



@router.post(
    "/registro-completo",
    status_code=status.HTTP_201_CREATED
)
def registrar_usuario_completo(
    nombre: str = Form(...),
    apellido: str = Form(...),
    username: str = Form(...),
    password: str = Form(...),
    rol: str = Form("usuario"),
    area_id: int = Form(...),
    horario_id: int = Form(...),
    archivo: UploadFile = File(...),
    db: Session = Depends(get_db),
    administrador: Usuario = Depends(obtener_administrador)
):

    ruta_archivo = None

    try:


        if len(nombre.strip()) < 2:
            raise HTTPException(
                status_code=400,
                detail="El nombre debe tener al menos 2 caracteres"
            )

        if len(apellido.strip()) < 2:
            raise HTTPException(
                status_code=400,
                detail="El apellido debe tener al menos 2 caracteres"
            )

        if len(username.strip()) < 3:
            raise HTTPException(
                status_code=400,
                detail="El username debe tener al menos 3 caracteres"
            )

        if len(password) < 6:
            raise HTTPException(
                status_code=400,
                detail="La contraseña debe tener al menos 6 caracteres"
            )

        if rol not in ["usuario", "administrador"]:
            raise HTTPException(
                status_code=400,
                detail="El rol debe ser usuario o administrador"
            )

        usuario_existente = (
            db.query(Usuario)
            .filter(
                Usuario.username == username
            )
            .first()
        )

        if usuario_existente:
            raise HTTPException(
                status_code=400,
                detail="El username ya está registrado"
            )


        area = (
            db.query(Area)
            .filter(
                Area.id == area_id
            )
            .first()
        )

        if not area:
            raise HTTPException(
                status_code=404,
                detail="Área no encontrada"
            )

        horario = (
            db.query(Horario)
            .filter(
                Horario.id == horario_id
            )
            .first()
        )

        if not horario:
            raise HTTPException(
                status_code=404,
                detail="Horario no encontrado"
            )


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

        extension = os.path.splitext(
            archivo.filename or ""
        )[1].lower()

        if extension not in [
            ".jpg",
            ".jpeg",
            ".png"
        ]:
            raise HTTPException(
                status_code=400,
                detail="Extensión de imagen no permitida"
            )


        nuevo_usuario = Usuario(
            nombre=nombre.strip(),
            apellido=apellido.strip(),
            username=username.strip(),
            password_hash=hash_password(password),
            rol=rol,
            area_id=area_id,
            horario_id=horario_id,
            activo=True
        )

        db.add(nuevo_usuario)

        db.flush()

        carpeta = os.path.join(
            "fotos_subidas",
            "jetas"
        )

        os.makedirs(
            carpeta,
            exist_ok=True
        )

        nombre_archivo = (
            f"{nuevo_usuario.id}{extension}"
        )

        ruta_archivo = os.path.join(
            carpeta,
            nombre_archivo
        )

        with open(
            ruta_archivo,
            "wb"
        ) as buffer:

            shutil.copyfileobj(
                archivo.file,
                buffer
            )

        nuevo_usuario.foto_rostro = (
            ruta_archivo.replace("\\", "/")
        )

        db.commit()
        db.refresh(nuevo_usuario)

        return {
            "mensaje": "Usuario registrado correctamente",
            "usuario": {
                "id": nuevo_usuario.id,
                "nombre": nuevo_usuario.nombre,
                "apellido": nuevo_usuario.apellido,
                "username": nuevo_usuario.username,
                "rol": nuevo_usuario.rol,
                "activo": nuevo_usuario.activo,
                "area_id": nuevo_usuario.area_id,
                "horario_id": nuevo_usuario.horario_id,
                "foto_rostro": nuevo_usuario.foto_rostro
            }
        }

    except HTTPException:
        db.rollback()

        if (
            ruta_archivo
            and os.path.exists(ruta_archivo)
        ):
            os.remove(ruta_archivo)

        raise

    except Exception as e:

        db.rollback()

        if (
            ruta_archivo
            and os.path.exists(ruta_archivo)
        ):
            os.remove(ruta_archivo)

        print(
            "Error registrando usuario completo:",
            e
        )

        raise HTTPException(
            status_code=500,
            detail="Error al registrar el usuario"
        )


@router.get(
    "/{usuario_id}",
    response_model=UsuarioResponse
)
def obtener_usuario(
    usuario_id: int,
    db: Session = Depends(get_db),
    administrador: Usuario = Depends(obtener_administrador)
):
    usuario = (
        db.query(Usuario)
        .filter(Usuario.id == usuario_id)
        .first()
    )
    if not usuario:
        raise HTTPException(
            status_code=404,
            detail="Usuario no encontrado"
        )
    return usuario


@router.put(
    "/{usuario_id}",
    response_model=UsuarioResponse
)
def actualizar_usuario(
    usuario_id: int,
    usuario_data: UsuarioUpdate,
    db: Session = Depends(get_db),
    administrador: Usuario = Depends(obtener_administrador)
):
    usuario = (
        db.query(Usuario)
        .filter(Usuario.id == usuario_id)
        .first()
    )
    if not usuario:
        raise HTTPException(
            status_code=404,
            detail="Usuario no encontrado"
        )
    datos = usuario_data.model_dump(
        exclude_unset=True
    )

    if "username" in datos:

        usuario_existente = (
            db.query(Usuario)
            .filter(
                Usuario.username == datos["username"],
                Usuario.id != usuario_id
            )
            .first()
        )

        if usuario_existente:
            raise HTTPException(
                status_code=400,
                detail="El username ya está registrado"
            )

    if "area_id" in datos:

        area = (
            db.query(Area)
            .filter(Area.id == datos["area_id"])
            .first()
        )
        if not area:
            raise HTTPException(
                status_code=404,
                detail="El área especificada no existe"
            )

    if "horario_id" in datos:

        horario = (
            db.query(Horario)
            .filter(Horario.id == datos["horario_id"])
            .first()
        )
        if not horario:
            raise HTTPException(
                status_code=404,
                detail="El horario especificado no existe"
            )

    if "password" in datos:

        usuario.password_hash = hash_password(
            datos["password"]
        )
        del datos["password"]

    for campo, valor in datos.items():

        setattr(
            usuario,
            campo,
            valor
        )

    db.commit()
    db.refresh(usuario)
    return usuario


@router.delete(
    "/{usuario_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
def eliminar_usuario(
    usuario_id: int,
    db: Session = Depends(get_db),
    administrador: Usuario = Depends(obtener_administrador)
):
    usuario = (
        db.query(Usuario)
        .filter(Usuario.id == usuario_id)
        .first()
    )
    if not usuario:
        raise HTTPException(
            status_code=404,
            detail="Usuario no encontrado"
        )
    db.delete(usuario)
    db.commit()
    return None

@router.post("/{usuario_id}/rostro")
def subir_rostro(
    usuario_id: int,
    archivo: UploadFile = File(...),
    db: Session = Depends(get_db),
    administrador: Usuario = Depends(obtener_administrador)
):
    usuario = (
        db.query(Usuario)
        .filter(Usuario.id == usuario_id)
        .first()
    )
    if not usuario:
        raise HTTPException(
            status_code=404,
            detail="Usuario no encontrado"
        )
    tipos_permitidos = [
        "image/jpeg",
        "image/png",
        "image/jpg"
    ]
    if archivo.content_type not in tipos_permitidos:
        raise HTTPException(
            status_code=400,
            detail="El archivo debe ser una imagen JPG o PNG"
        )

    carpeta = os.path.join(
        "fotos_subidas",
        "jetas"
    )

    os.makedirs(
        carpeta,
        exist_ok=True
    )

    extension = os.path.splitext(
        archivo.filename
    )[1].lower()

    nombre_archivo = f"{usuario_id}{extension}"

    ruta_archivo = os.path.join(
        carpeta,
        nombre_archivo
    )

    with open(ruta_archivo, "wb") as buffer:
        shutil.copyfileobj(
            archivo.file,
            buffer
        )

    usuario.foto_rostro = ruta_archivo.replace(
        "\\",
        "/"
    )

    db.commit()
    db.refresh(usuario)

    return {
        "mensaje": "Rostro registrado correctamente",
        "usuario_id": usuario.id,
        "foto_rostro": usuario.foto_rostro
    }