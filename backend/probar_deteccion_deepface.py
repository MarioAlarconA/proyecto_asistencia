from deepface import DeepFace

imagenes = [
    "fotos_subidas/jetas/1.jpeg",
    "fotos_subidas/jetas/TEST_PRUEBA.jpg"
]

for imagen in imagenes:

    print("\n==============================")
    print("IMAGEN:", imagen)
    print("==============================")

    try:
        rostros = DeepFace.extract_faces(
            img_path=imagen,
            detector_backend="opencv",
            enforce_detection=False
        )

        print("Rostros encontrados:", len(rostros))

        for i, rostro in enumerate(rostros):
            print(
                f"Rostro {i + 1}:",
                rostro["facial_area"]
            )

    except Exception as e:
        print("ERROR:", e)