from sqlalchemy import Column, Integer, String, Time
from app.db.connection import Base

class Horario(Base):
    __tablename__ = "horarios"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    hora_entrada = Column(Time, nullable=False)
    hora_salida = Column(Time, nullable=False)