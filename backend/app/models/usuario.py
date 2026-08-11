from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.db.connection import Base

class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)

    nombre = Column(String(100), nullable=False)
    apellido = Column(String(100), nullable=False)
    username = Column(String(100), nullable=False, unique=True, index=True)
    password_hash = Column(String(255), nullable=False)
    rol = Column(String(20), nullable=False, default="usuario")
    activo = Column(Boolean, default=True)
    area_id = Column(
        Integer,
        ForeignKey("areas.id"),
        nullable=False
    )
    horario_id = Column(
        Integer,
        ForeignKey("horarios.id"),
        nullable=False
    )
    rostro_path = Column(
        String(255),
        nullable=True
    )
    foto_rostro = Column(
        String(255),
        nullable=True
    )
    area = relationship(
        "Area",
        back_populates="usuarios"
    )
    horario = relationship(
        "Horario",
        back_populates="usuarios"
    )
    asistencias = relationship(
        "Asistencia",
        back_populates="usuario"
    )
    permisos = relationship(
        "Permiso",
        back_populates="usuario"
    )
    