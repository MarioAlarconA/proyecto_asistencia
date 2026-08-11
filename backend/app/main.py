from fastapi import FastAPI
from sqlalchemy import text
from app.db.connection import engine, Base
from app.models.area import Area
from app.models.horario import Horario
from app.models.usuario import Usuario
from app.models.asistencia import Asistencia
from app.models.permiso import Permiso
from app.routes.usuarios import router as usuarios_router
from app.routes.auth import router as auth_router
from app.routes.horarios import router as horarios_router
from app.routes.permisos import router as permisos_router
from app.routes.asistencias import router as asistencias_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="API Control de Asistencia",
    description="API para control de asistencia mediante reconocimiento facial",
    version="1.0.0"
)

app.include_router(usuarios_router)
app.include_router(auth_router)
app.include_router(horarios_router)
app.include_router(permisos_router)
app.include_router(asistencias_router)

@app.get("/")
def inicio():
    return {
        "mensaje": "API de reconocimiento facial funcionando",
        "estado": "OK"
    }

@app.get("/health")
def health():
    return {
        "status": "healthy"
    }

@app.get("/test-db")
def test_db():
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))

        return {
            "database": "conectada",
            "status": "OK"
        }
    except Exception as e:

        return {
            "database": "error",
            "detalle": str(e)
        }