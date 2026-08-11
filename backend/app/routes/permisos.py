from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.connection import get_db
from app.models.permiso import Permiso
from app.models.usuario import Usuario
from app.schemas.permiso import (
    PermisoCreate,
    PermisoUpdate,
    PermisoResponse
)
from app.services.dependencies import (
    obtener_usuario_actual,
    obtener_administrador
)


router = APIRouter(
    prefix="/permisos",
    tags=["Permisos"]
)


@router.post(
    "/",
    response_model=PermisoResponse,
    status_code=status.HTTP_201_CREATED
)
def crear_permiso(
    permiso_data: PermisoCreate,
    db: Session = Depends(get_db),
    usuario: Usuario = Depends(obtener_usuario_actual)
):
    if permiso_data.fecha_fin < permiso_data.fecha_inicio:
        raise HTTPException(
            status_code=400,
            detail="La fecha final no puede ser anterior a la fecha inicial"
        )
    nuevo_permiso = Permiso(
        usuario_id=usuario.id,
        tipo=permiso_data.tipo,
        fecha_inicio=permiso_data.fecha_inicio,
        fecha_fin=permiso_data.fecha_fin,
        motivo=permiso_data.motivo,
        estado="pendiente"
    )
    db.add(nuevo_permiso)
    db.commit()
    db.refresh(nuevo_permiso)

    return nuevo_permiso

@router.get(
    "/mis-permisos",
    response_model=list[PermisoResponse]
)
def obtener_mis_permisos(
    db: Session = Depends(get_db),
    usuario: Usuario = Depends(obtener_usuario_actual)
):
    permisos = (
        db.query(Permiso)
        .filter(
            Permiso.usuario_id == usuario.id
        )
        .order_by(Permiso.fecha_inicio.desc())
        .all()
    )

    return permisos

@router.get(
    "/",
    response_model=list[PermisoResponse]
)
def obtener_todos_los_permisos(
    db: Session = Depends(get_db),
    administrador: Usuario = Depends(obtener_administrador)
):
    permisos = (
        db.query(Permiso)
        .order_by(Permiso.fecha_inicio.desc())
        .all()
    )

    return permisos

@router.get(
    "/{permiso_id}",
    response_model=PermisoResponse
)
def obtener_permiso(
    permiso_id: int,
    db: Session = Depends(get_db),
    usuario: Usuario = Depends(obtener_usuario_actual)
):
    permiso = (
        db.query(Permiso)
        .filter(
            Permiso.id == permiso_id
        )
        .first()
    )
    if not permiso:
        raise HTTPException(
            status_code=404,
            detail="Permiso no encontrado"
        )

    if (
        permiso.usuario_id != usuario.id
        and usuario.rol != "administrador"
    ):
        raise HTTPException(
            status_code=403,
            detail="No tienes permiso para consultar este registro"
        )

    return permiso

@router.put(
    "/{permiso_id}",
    response_model=PermisoResponse
)
def actualizar_permiso(
    permiso_id: int,
    permiso_data: PermisoUpdate,
    db: Session = Depends(get_db),
    usuario: Usuario = Depends(obtener_usuario_actual)
):
    permiso = (
        db.query(Permiso)
        .filter(
            Permiso.id == permiso_id
        )
        .first()
    )
    if not permiso:
        raise HTTPException(
            status_code=404,
            detail="Permiso no encontrado"
        )

    if (
        permiso.usuario_id != usuario.id
        and usuario.rol != "administrador"
    ):
        raise HTTPException(
            status_code=403,
            detail="No puedes modificar este permiso"
        )

    datos = permiso_data.model_dump(
        exclude_unset=True
    )
    fecha_inicio = datos.get(
        "fecha_inicio",
        permiso.fecha_inicio
    )
    fecha_fin = datos.get(
        "fecha_fin",
        permiso.fecha_fin
    )

    if fecha_fin < fecha_inicio:
        raise HTTPException(
            status_code=400,
            detail="La fecha final no puede ser anterior a la fecha inicial"
        )
    if usuario.rol != "administrador":
        datos.pop("estado", None)

    for campo, valor in datos.items():
        setattr(
            permiso,
            campo,
            valor
        )

    db.commit()
    db.refresh(permiso)

    return permiso

@router.delete(
    "/{permiso_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
def eliminar_permiso(
    permiso_id: int,
    db: Session = Depends(get_db),
    usuario: Usuario = Depends(obtener_usuario_actual)
):
    permiso = (
        db.query(Permiso)
        .filter(
            Permiso.id == permiso_id
        )
        .first()
    )
    if not permiso:
        raise HTTPException(
            status_code=404,
            detail="Permiso no encontrado"
        )

    if (
        permiso.usuario_id != usuario.id
        and usuario.rol != "administrador"
    ):
        raise HTTPException(
            status_code=403,
            detail="No puedes eliminar este permiso"
        )

    db.delete(permiso)
    db.commit()

    return None