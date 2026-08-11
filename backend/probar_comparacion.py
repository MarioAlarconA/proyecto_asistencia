from deepface import DeepFace

foto1 = "fotos_subidas/jetas/1.jpeg"
foto2 = "fotos_subidas/jetas/3.png"

print("==============================")
print("COMPARACIÓN DE ROSTROS")
print("==============================")

try:
    resultado = DeepFace.verify(
        img1_path=foto1,
        img2_path=foto2,
        model_name="VGG-Face",
        detector_backend="opencv",
        distance_metric="cosine",
        enforce_detection=False
    )

    print("Verificado:", resultado["verified"])
    print("Distancia:", resultado["distance"])
    print("Umbral:", resultado["threshold"])
    print("Modelo:", resultado["model"])
    print("Detector:", resultado["detector_backend"])

except Exception as e:
    print("ERROR:")
    print(e)