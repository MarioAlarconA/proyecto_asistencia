from pydantic import BaseModel, Field, ConfigDict

class UsuarioCreate(BaseModel):
    nombre: str = Field(..., min_length=2, max_length=100)
    apellido: str = Field(..., min_length=2, max_length=100)
    username: str = Field(..., min_length=3, max_length=100)
    password: str = Field(..., min_length=6, max_length=100)
    rol: str = Field(
        default="usuario",
        pattern="^(usuario|administrador)$"
    )
    area_id: int = Field(..., gt=0)
    horario_id: int = Field(..., gt=0)

class UsuarioUpdate(BaseModel):
    nombre: str | None = Field(
        default=None,
        min_length=2,
        max_length=100
    )
    apellido: str | None = Field(
        default=None,
        min_length=2,
        max_length=100
    )
    username: str | None = Field(
        default=None,
        min_length=3,
        max_length=100
    )
    password: str | None = Field(
        default=None,
        min_length=6,
        max_length=100
    )
    rol: str | None = Field(
        default=None,
        pattern="^(usuario|administrador)$"
    )
    area_id: int | None = Field(
        default=None,
        gt=0
    )
    horario_id: int | None = Field(
        default=None,
        gt=0
    )
    activo: bool | None = None

class UsuarioResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    nombre: str
    apellido: str
    username: str
    rol: str
    activo: bool
    area_id: int
    horario_id: int
    rostro_path: str | None = None