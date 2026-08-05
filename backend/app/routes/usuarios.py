from fastapi import APIRouter, Depends, HTTPException, status
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
    db: Session = Depends(get_db)
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
    db: Session = Depends(get_db)
):
    usuarios = (
        db.query(Usuario)
        .order_by(Usuario.id)
        .all()
    )
    return usuarios


@router.get(
    "/{usuario_id}",
    response_model=UsuarioResponse
)
def obtener_usuario(
    usuario_id: int,
    db: Session = Depends(get_db)
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
    db: Session = Depends(get_db)
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
    db: Session = Depends(get_db)
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