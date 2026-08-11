from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.connection import get_db
from app.models.usuario import Usuario
from app.schemas.auth import (
    LoginRequest,
    LoginResponse
)
from app.services.password import verify_password
from app.services.auth import crear_token_acceso

router = APIRouter(
    prefix="/auth",
    tags=["Autenticación"]
)

@router.post(
    "/login",
    response_model=LoginResponse
)
def login(
    datos: LoginRequest,
    db: Session = Depends(get_db)
):
    usuario = (
        db.query(Usuario)
        .filter(
            Usuario.username == datos.username
        )
        .first()
    )
    if not usuario:
        raise HTTPException(
            status_code=401,
            detail="Usuario o contraseña incorrectos"
        )
    if not usuario.activo:
        raise HTTPException(
            status_code=403,
            detail="El usuario está inactivo"
        )

    contraseña_correcta = verify_password(
        datos.password,
        usuario.password_hash
    )
    if not contraseña_correcta:
        raise HTTPException(
            status_code=401,
            detail="Usuario o contraseña incorrectos"
        )

    token = crear_token_acceso(
        usuario.id,
        usuario.username,
        usuario.rol
    )

    return {
        "access_token": token,
        "token_type": "bearer",
        "usuario_id": usuario.id,
        "username": usuario.username,
        "rol": usuario.rol
    }