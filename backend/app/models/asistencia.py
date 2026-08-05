from sqlalchemy import Column, Integer, Date, Time, String, ForeignKey
from sqlalchemy.orm import relationship
from app.db.connection import Base

class Asistencia(Base):
    __tablename__ = "asistencias"

    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(
        Integer,
        ForeignKey("usuarios.id"),
        nullable=False
    )
    fecha = Column(
        Date,
        nullable=False
    )
    hora_entrada = Column(
        Time,
        nullable=True
    )
    hora_salida = Column(
        Time,
        nullable=True
    )
    estado = Column(
        String(30),
        nullable=False,
        default="presente"
    )
    metodo = Column(
        String(30),
        nullable=False,
        default="facial"
    )
    usuario = relationship(
        "Usuario",
        back_populates="asistencias"
    )