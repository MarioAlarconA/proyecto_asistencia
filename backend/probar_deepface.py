from deepface import DeepFace

imagen1 = "fotos_subidas/jetas/3.png"
imagen2 = "fotos_subidas/jetas/4.jpg"

try:
    resultado = DeepFace.verify(
        img1_path=imagen1,
        img2_path=imagen2,
        detector_backend="opencv"
    )

    print("================================")
    print("COMPARACIÓN DE ROSTROS")
    print("================================")

    print("¿Misma persona?:", resultado["verified"])
    print("Distancia:", resultado["distance"])
    print("Umbral:", resultado["threshold"])
    print("Modelo:", resultado["model"])

except Exception as e:
    print("================================")
    print("ERROR")
    print("================================")
    print(e)