import os
from deepface import DeepFace


CARPETA_ROSTROS = "fotos_subidas/jetas"


def reconocer_rostro(imagen_prueba):

    if not os.path.exists(CARPETA_ROSTROS):
        return None

    for archivo in os.listdir(CARPETA_ROSTROS):

        ruta_rostro = os.path.join(CARPETA_ROSTROS, archivo)

        # Ignorar archivos que no sean imágenes
        if not archivo.lower().endswith((".jpg", ".jpeg", ".png")):
            continue

        try:

            resultado = DeepFace.verify(
                img1_path=imagen_prueba,
                img2_path=ruta_rostro,
                detector_backend="opencv",
                enforce_detection=True
            )

            if resultado["verified"]:

                # Obtener el ID del usuario a partir del nombre
                nombre_archivo = os.path.splitext(archivo)[0]

                return {
                    "usuario_id": int(nombre_archivo),
                    "distancia": resultado["distance"],
                    "archivo": archivo
                }

        except Exception as e:

            print(f"Error comparando con {archivo}: {e}")

    return None