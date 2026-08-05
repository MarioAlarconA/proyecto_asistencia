from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.db.connection import Base

class Area(Base):
    __tablename__ = "areas"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False, unique=True)
    descripcion = Column(String(255), nullable=True)
    usuarios = relationship(
        "Usuario",
        back_populates="area"
    )