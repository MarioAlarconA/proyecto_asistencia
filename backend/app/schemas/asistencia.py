from datetime import date, time
from pydantic import BaseModel, ConfigDict

class AsistenciaCreate(BaseModel):
    usuario_id: int
    fecha: date
    hora_entrada: time | None = None
    hora_salida: time | None = None
    estado: str | None = "presente"
    metodo: str | None = "manual"

class AsistenciaUpdate(BaseModel):
    fecha: date | None = None
    hora_entrada: time | None = None
    hora_salida: time | None = None
    estado: str | None = None
    metodo: str | None = None

class AsistenciaResponse(BaseModel):
    model_config = ConfigDict(
        from_attributes=True
    )
    id: int
    usuario_id: int
    fecha: date
    hora_entrada: time | None
    hora_salida: time | None
    estado: str | None
    metodo: str | None