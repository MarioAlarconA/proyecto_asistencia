from sqlalchemy import Column, Integer, Date, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.db.connection import Base

class Permiso(Base):
    __tablename__ = "permisos"

    id = Column(Integer, primary_key=True, index=True)

    usuario_id = Column(
        Integer,
        ForeignKey("usuarios.id"),
        nullable=False
    )
    tipo = Column(
        String(50),
        nullable=False
    )
    fecha_inicio = Column(
        Date,
        nullable=False
    )
    fecha_fin = Column(
        Date,
        nullable=False
    )
    motivo = Column(
        Text,
        nullable=True
    )
    estado = Column(
        String(30),
        nullable=False,
        default="pendiente"
    )
    usuario = relationship(
        "Usuario",
        back_populates="permisos"
    )