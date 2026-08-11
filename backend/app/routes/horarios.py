from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.connection import get_db
from app.models.horario import Horario
from app.models.usuario import Usuario
from app.schemas.horario import (
    HorarioCreate,
    HorarioUpdate,
    HorarioResponse
)
from app.services.dependencies import obtener_administrador


router = APIRouter(
    prefix="/horarios",
    tags=["Horarios"]
)

@router.post(
    "/",
    response_model=HorarioResponse,
    status_code=status.HTTP_201_CREATED
)
def crear_horario(
    horario_data: HorarioCreate,
    db: Session = Depends(get_db),
    administrador: Usuario = Depends(obtener_administrador)
):
    horario_existente = (
        db.query(Horario)
        .filter(
            Horario.nombre == horario_data.nombre
        )
        .first()
    )
    if horario_existente:
        raise HTTPException(
            status_code=400,
            detail="Ya existe un horario con ese nombre"
        )
    nuevo_horario = Horario(
        nombre=horario_data.nombre,
        hora_entrada=horario_data.hora_entrada,
        hora_salida=horario_data.hora_salida
    )
    db.add(nuevo_horario)
    db.commit()
    db.refresh(nuevo_horario)

    return nuevo_horario


@router.get(
    "/",
    response_model=list[HorarioResponse]
)
def obtener_horarios(
    db: Session = Depends(get_db),
    administrador: Usuario = Depends(obtener_administrador)
):
    horarios = (
        db.query(Horario)
        .order_by(Horario.id)
        .all()
    )
    return horarios


@router.get(
    "/{horario_id}",
    response_model=HorarioResponse
)
def obtener_horario(
    horario_id: int,
    db: Session = Depends(get_db),
    administrador: Usuario = Depends(obtener_administrador)
):
    horario = (
        db.query(Horario)
        .filter(Horario.id == horario_id)
        .first()
    )
    if not horario:
        raise HTTPException(
            status_code=404,
            detail="Horario no encontrado"
        )
    return horario


@router.put(
    "/{horario_id}",
    response_model=HorarioResponse
)
def actualizar_horario(
    horario_id: int,
    horario_data: HorarioUpdate,
    db: Session = Depends(get_db),
    administrador: Usuario = Depends(obtener_administrador)
):
    horario = (
        db.query(Horario)
        .filter(Horario.id == horario_id)
        .first()
    )
    if not horario:
        raise HTTPException(
            status_code=404,
            detail="Horario no encontrado"
        )
    datos = horario_data.model_dump(
        exclude_unset=True
    )
    if "nombre" in datos:
        horario_existente = (
            db.query(Horario)
            .filter(
                Horario.nombre == datos["nombre"],
                Horario.id != horario_id
            )
            .first()
        )
        if horario_existente:
            raise HTTPException(
                status_code=400,
                detail="Ya existe un horario con ese nombre"
            )
    for campo, valor in datos.items():
        setattr(
            horario,
            campo,
            valor
        )

    db.commit()
    db.refresh(horario)

    return horario


@router.delete(
    "/{horario_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
def eliminar_horario(
    horario_id: int,
    db: Session = Depends(get_db),
    administrador: Usuario = Depends(obtener_administrador)
):
    horario = (
        db.query(Horario)
        .filter(Horario.id == horario_id)
        .first()
    )
    if not horario:
        raise HTTPException(
            status_code=404,
            detail="Horario no encontrado"
        )
    usuarios_asignados = (
        db.query(Usuario)
        .filter(
            Usuario.horario_id == horario_id
        )
        .count()
    )
    if usuarios_asignados > 0:
        raise HTTPException(
            status_code=400,
            detail=(
                "No se puede eliminar el horario "
                "porque tiene usuarios asignados"
            )
        )

    db.delete(horario)
    db.commit()

    return None