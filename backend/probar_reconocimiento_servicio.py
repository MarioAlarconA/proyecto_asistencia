from app.db.connection import SessionLocal
from app.services.reconocimiento import reconocer_usuario


db = SessionLocal()

try:

    imagen = "fotos_subidas/jetas/prueba.png"

    resultado = reconocer_usuario(
        imagen_prueba=imagen,
        db=db
    )

    print("\n================================")
    print("RECONOCIMIENTO FACIAL")
    print("================================")

    if not resultado:
        print("USUARIO NO IDENTIFICADO")

    else:
        print("USUARIO IDENTIFICADO")
        print("ID:", resultado["usuario_id"])
        print(
            "Nombre:",
            resultado["nombre"],
            resultado["apellido"]
        )
        print(
            "Distancia:",
            round(resultado["distancia"], 6)
        )
        print(
            "Umbral:",
            resultado["umbral"]
        )

finally:
    db.close()