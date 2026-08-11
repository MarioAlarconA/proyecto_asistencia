from datetime import time
from pydantic import BaseModel, Field, ConfigDict

class HorarioCreate(BaseModel):

    nombre: str = Field(
        ...,
        min_length=2,
        max_length=100
    )

    hora_entrada: time
    hora_salida: time
    tolerancia_minutos: int = 10

class HorarioUpdate(BaseModel):

    nombre: str | None = Field(
        default=None,
        min_length=2,
        max_length=100
    )

    hora_entrada: time | None = None
    hora_salida: time | None = None
    tolerancia_minutos: int | None = None

class HorarioResponse(BaseModel):

    model_config = ConfigDict(
        from_attributes=True
    )

    id: int
    nombre: str
    hora_entrada: time
    hora_salida: time
    tolerancia_minutos: int