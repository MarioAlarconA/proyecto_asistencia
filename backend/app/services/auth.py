import os
from datetime import datetime, timedelta, timezone
import jwt
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256")

ACCESS_TOKEN_EXPIRE_MINUTES = int(
    os.getenv(
        "ACCESS_TOKEN_EXPIRE_MINUTES",
        "60"
    )
)


def crear_token_acceso(
    usuario_id: int,
    username: str,
    rol: str
):
    ahora = datetime.now(timezone.utc)
    expiracion = ahora + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )
    datos = {
        "sub": str(usuario_id),
        "username": username,
        "rol": rol,
        "iat": ahora,
        "exp": expiracion
    }
    token = jwt.encode(
        datos,
        SECRET_KEY,
        algorithm=ALGORITHM
    )
    return token


def verificar_token(token: str):
    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )
        return payload
    except jwt.InvalidTokenError:
        return None