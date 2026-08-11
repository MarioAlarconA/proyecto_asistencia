import os

from deepface import DeepFace
from sqlalchemy.orm import Session

from app.models.usuario import Usuario


MODEL_NAME = "VGG-Face"
DETECTOR_BACKEND = "opencv"
DISTANCE_METRIC = "cosine"


def reconocer_usuario(
    imagen_prueba: str,
    db: Session
):
    usuarios = (
        db.query(Usuario)
        .filter(
            Usuario.foto_rostro.isnot(None),
            Usuario.activo == True
        )
        .all()
    )

    mejor_usuario = None
    mejor_distancia = None
    mejor_umbral = None

    for usuario in usuarios:

        if not usuario.foto_rostro:
            continue

        ruta_rostro = usuario.foto_rostro

        if not os.path.exists(ruta_rostro):
            print(
                f"Foto no encontrada para usuario {usuario.id}: "
                f"{ruta_rostro}"
            )
            continue

        try:
            resultado = DeepFace.verify(
                img1_path=imagen_prueba,
                img2_path=ruta_rostro,
                model_name=MODEL_NAME,
                detector_backend=DETECTOR_BACKEND,
                distance_metric=DISTANCE_METRIC,
                enforce_detection=False
            )

            distancia = resultado["distance"]
            umbral = resultado["threshold"]

            print(
                f"Usuario {usuario.id} -> "
                f"distancia: {distancia:.4f}, "
                f"umbral: {umbral}"
            )

            if mejor_distancia is None or distancia < mejor_distancia:
                mejor_distancia = distancia
                mejor_usuario = usuario
                mejor_umbral = umbral

        except Exception as e:
            print(
                f"Error comparando usuario {usuario.id}: {e}"
            )

    if mejor_usuario is None:
        return None

    if mejor_distancia > mejor_umbral:
        return None

    return {
        "usuario": mejor_usuario,
        "usuario_id": mejor_usuario.id,
        "nombre": mejor_usuario.nombre,
        "apellido": mejor_usuario.apellido,
        "distancia": mejor_distancia,
        "umbral": mejor_umbral
    }