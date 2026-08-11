from datetime import date
from pydantic import BaseModel, Field, ConfigDict

class PermisoCreate(BaseModel):
    tipo: str = Field(
        ...,
        min_length=2,
        max_length=50
    )
    fecha_inicio: date
    fecha_fin: date
    motivo: str | None = None

class PermisoUpdate(BaseModel):
    tipo: str | None = Field(
        default=None,
        min_length=2,
        max_length=50
    )
    fecha_inicio: date | None = None
    fecha_fin: date | None = None
    motivo: str | None = None
    estado: str | None = None

class PermisoResponse(BaseModel):
    model_config = ConfigDict(
        from_attributes=True
    )
    id: int
    usuario_id: int
    tipo: str
    fecha_inicio: date
    fecha_fin: date
    motivo: str | None
    estado: str