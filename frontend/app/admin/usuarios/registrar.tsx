import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View
} from "react-native";

import {
  SafeAreaView
} from "react-native-safe-area-context";

import {
  CameraView,
  useCameraPermissions
} from "expo-camera";

import {
  router
} from "expo-router";

import {
  useRef,
  useState
} from "react";

import {
  registrarUsuarioCompleto
} from "../../../services/usuarios";


export default function RegistrarUsuarioScreen() {

  const cameraRef =
    useRef<CameraView | null>(null);


  const [
    permisoCamara,
    solicitarPermiso
  ] = useCameraPermissions();


  // =====================================================
  // DATOS DEL USUARIO
  // =====================================================

  const [nombre, setNombre] =
    useState("");

  const [apellido, setApellido] =
    useState("");

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [rol, setRol] =
    useState<
      "usuario" |
      "administrador"
    >("usuario");

  const [areaId, setAreaId] =
    useState("");

  const [horarioId, setHorarioId] =
    useState("");


  // =====================================================
  // CÁMARA
  // =====================================================

  const [fotoUri, setFotoUri] =
    useState<string | null>(null);

  const [
    mostrarCamara,
    setMostrarCamara
  ] = useState(false);

  const [
    camaraLista,
    setCamaraLista
  ] = useState(false);

  const [
    errorCamara,
    setErrorCamara
  ] = useState("");


  // =====================================================
  // ESTADOS
  // =====================================================

  const [
    registrando,
    setRegistrando
  ] = useState(false);

  const [error, setError] =
    useState("");


  // =====================================================
  // ABRIR CÁMARA
  // =====================================================

  const abrirCamara = async () => {

    setError("");
    setErrorCamara("");
    setCamaraLista(false);


    try {

      if (!permisoCamara?.granted) {

        const resultado =
          await solicitarPermiso();


        if (!resultado.granted) {

          Alert.alert(
            "Permiso necesario",
            "Debes permitir el acceso a la cámara para registrar el rostro."
          );

          return;
        }
      }


      setMostrarCamara(true);


    } catch (e) {

      console.log(
        "Error solicitando cámara:",
        e
      );

      setError(
        "No fue posible abrir la cámara"
      );
    }
  };


  // =====================================================
  // CERRAR CÁMARA
  // =====================================================

  const cerrarCamara = () => {

    setMostrarCamara(false);
    setCamaraLista(false);
    setErrorCamara("");
  };


  // =====================================================
  // TOMAR FOTO
  // =====================================================

  const tomarFoto = async () => {

    if (!cameraRef.current) {

      Alert.alert(
        "Cámara",
        "La cámara todavía no está disponible."
      );

      return;
    }


    if (!camaraLista) {

      Alert.alert(
        "Cámara",
        "Espera un momento a que la cámara termine de iniciar."
      );

      return;
    }


    try {

      const foto =
        await cameraRef.current
          .takePictureAsync({
            quality: 0.8
          });


      if (!foto?.uri) {

        throw new Error(
          "La cámara no devolvió una imagen"
        );
      }


      console.log(
        "FOTO CAPTURADA:",
        foto.uri
      );


      setFotoUri(
        foto.uri
      );

      setMostrarCamara(
        false
      );

      setCamaraLista(
        false
      );

      setErrorCamara(
        ""
      );


    } catch (e) {

      console.log(
        "Error tomando foto:",
        e
      );


      Alert.alert(
        "Error",
        "No fue posible tomar la fotografía."
      );
    }
  };


  // =====================================================
  // REGISTRAR USUARIO
  // =====================================================

  const registrar = async () => {

    setError("");


    if (!nombre.trim()) {

      setError(
        "Ingresa el nombre"
      );

      return;
    }


    if (!apellido.trim()) {

      setError(
        "Ingresa el apellido"
      );

      return;
    }


    if (!username.trim()) {

      setError(
        "Ingresa el username"
      );

      return;
    }


    if (password.length < 6) {

      setError(
        "La contraseña debe tener al menos 6 caracteres"
      );

      return;
    }


    const area =
      Number(areaId);

    const horario =
      Number(horarioId);


    if (
      Number.isNaN(area) ||
      area <= 0
    ) {

      setError(
        "Ingresa un área válida"
      );

      return;
    }


    if (
      Number.isNaN(horario) ||
      horario <= 0
    ) {

      setError(
        "Ingresa un horario válido"
      );

      return;
    }


    if (!fotoUri) {

      setError(
        "Debes capturar el rostro del usuario"
      );

      return;
    }


    try {

      setRegistrando(true);


      await registrarUsuarioCompleto({
        nombre:
          nombre.trim(),

        apellido:
          apellido.trim(),

        username:
          username.trim(),

        password,

        rol,

        area_id:
          area,

        horario_id:
          horario,

        fotoUri
      });


      Alert.alert(
        "Usuario registrado",
        "El usuario y su rostro fueron registrados correctamente.",
        [
          {
            text: "Aceptar",

            onPress: () => {
              router.back();
            }
          }
        ]
      );


    } catch (e) {

      if (e instanceof Error) {

        setError(
          e.message
        );

      } else {

        setError(
          "Error al registrar usuario"
        );
      }

    } finally {

      setRegistrando(false);
    }
  };


  // =====================================================
  // PANTALLA DE CÁMARA
  // =====================================================

  if (mostrarCamara) {

    return (

      <View
        style={{
          flex: 1,
          backgroundColor: "black"
        }}
      >

        <CameraView
          ref={cameraRef}
          style={{
            flex: 1
          }}
          facing="front"
          mode="picture"
          onCameraReady={() => {

            console.log(
              "CAMARA LISTA"
            );

            setCamaraLista(
              true
            );

            setErrorCamara(
              ""
            );
          }}
          onMountError={(evento) => {

            console.log(
              "ERROR CAMARA:",
              evento.message
            );


            setCamaraLista(
              false
            );


            setErrorCamara(
              evento.message ||
              "No fue posible iniciar la cámara"
            );
          }}
        />


        {/* ENCABEZADO */}

        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            paddingTop: 60,
            paddingBottom: 20,
            paddingHorizontal: 24,
            backgroundColor:
              "rgba(0,0,0,0.45)",
            alignItems: "center"
          }}
        >

          <Text
            style={{
              color: "white",
              fontSize: 24,
              fontWeight: "bold"
            }}
          >
            Capturar rostro
          </Text>


          <Text
            style={{
              color: "white",
              marginTop: 8,
              textAlign: "center"
            }}
          >
            Coloca el rostro de frente dentro de la guía
          </Text>

        </View>


        {/* GUÍA DEL ROSTRO */}

        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            alignItems: "center",
            justifyContent: "center"
          }}
        >

          <View
            style={{
              width: 260,
              height: 330,
              borderRadius: 150,
              borderWidth: 4,
              borderColor: "white"
            }}
          />

        </View>


        {/* ERROR DE CÁMARA */}

        {errorCamara ? (

          <View
            style={{
              position: "absolute",
              top: 150,
              left: 24,
              right: 24,
              padding: 16,
              borderRadius: 16,
              backgroundColor:
                "rgba(127,29,29,0.95)"
            }}
          >

            <Text
              style={{
                color: "white",
                textAlign: "center"
              }}
            >
              Error de cámara:
              {" "}
              {errorCamara}
            </Text>

          </View>

        ) : null}


        {/* ESTADO CARGANDO */}

        {!camaraLista &&
        !errorCamara ? (

          <View
            pointerEvents="none"
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              alignItems: "center",
              justifyContent: "center"
            }}
          >

            <ActivityIndicator
              size="large"
              color="white"
            />


            <Text
              style={{
                marginTop: 20,
                color: "white",
                fontWeight: "600"
              }}
            >
              Iniciando cámara...
            </Text>

          </View>

        ) : null}


        {/* CONTROLES */}

        <View
          style={{
            position: "absolute",
            bottom: 45,
            left: 0,
            right: 0,
            flexDirection: "row",
            alignItems: "center",
            justifyContent:
              "space-between",
            paddingHorizontal: 35
          }}
        >

          {/* CANCELAR */}

          <Pressable
            onPress={
              cerrarCamara
            }
            style={{
              minWidth: 95,
              height: 54,
              borderRadius: 30,
              backgroundColor:
                "rgba(15,23,42,0.9)",
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: 18
            }}
          >

            <Text
              style={{
                color: "white",
                fontWeight: "bold"
              }}
            >
              Cancelar
            </Text>

          </Pressable>


          {/* CAPTURAR */}

          <Pressable
            onPress={
              tomarFoto
            }
            disabled={
              !camaraLista
            }
            style={{
              width: 82,
              height: 82,
              borderRadius: 41,
              borderWidth: 4,
              borderColor:
                camaraLista
                  ? "white"
                  : "#64748b",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor:
                "rgba(255,255,255,0.20)",
              opacity:
                camaraLista
                  ? 1
                  : 0.5
            }}
          >

            {camaraLista ? (

              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  backgroundColor:
                    "white"
                }}
              />

            ) : (

              <ActivityIndicator
                color="white"
              />

            )}

          </Pressable>


          {/* ESPACIO */}

          <View
            style={{
              width: 95
            }}
          />

        </View>

      </View>
    );
  }


  // =====================================================
  // FORMULARIO
  // =====================================================

  return (

    <SafeAreaView
      className="flex-1 bg-slate-950"
    >

      <KeyboardAvoidingView
        className="flex-1"
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : undefined
        }
      >

        <ScrollView
          contentContainerClassName="
            px-6
            pb-16
          "
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >

          {/* VOLVER */}

          <Pressable
            onPress={() =>
              router.back()
            }
            className="mt-4"
          >

            <Text
              className="
                text-base
                font-semibold
                text-blue-500
              "
            >
              ‹ Volver
            </Text>

          </Pressable>


          {/* ENCABEZADO */}

          <Text
            className="
              mt-7
              text-3xl
              font-bold
              text-white
            "
          >
            Registrar usuario
          </Text>


          <Text
            className="
              mt-2
              leading-6
              text-slate-400
            "
          >
            Ingresa los datos del usuario y captura una fotografía frontal de su rostro.
          </Text>


          {/* NOMBRE */}

          <Text
            className="
              mb-2
              mt-8
              font-semibold
              text-slate-200
            "
          >
            Nombre
          </Text>


          <TextInput
            value={nombre}
            onChangeText={setNombre}
            placeholder="Nombre"
            placeholderTextColor="#64748b"
            className="
              h-14
              rounded-2xl
              border
              border-slate-700
              bg-slate-900
              px-4
              text-white
            "
          />


          {/* APELLIDO */}

          <Text
            className="
              mb-2
              mt-5
              font-semibold
              text-slate-200
            "
          >
            Apellido
          </Text>


          <TextInput
            value={apellido}
            onChangeText={setApellido}
            placeholder="Apellido"
            placeholderTextColor="#64748b"
            className="
              h-14
              rounded-2xl
              border
              border-slate-700
              bg-slate-900
              px-4
              text-white
            "
          />


          {/* USERNAME */}

          <Text
            className="
              mb-2
              mt-5
              font-semibold
              text-slate-200
            "
          >
            Usuario
          </Text>


          <TextInput
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="Username"
            placeholderTextColor="#64748b"
            className="
              h-14
              rounded-2xl
              border
              border-slate-700
              bg-slate-900
              px-4
              text-white
            "
          />


          {/* CONTRASEÑA */}

          <Text
            className="
              mb-2
              mt-5
              font-semibold
              text-slate-200
            "
          >
            Contraseña
          </Text>


          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="Mínimo 6 caracteres"
            placeholderTextColor="#64748b"
            className="
              h-14
              rounded-2xl
              border
              border-slate-700
              bg-slate-900
              px-4
              text-white
            "
          />


          {/* ROL */}

          <Text
            className="
              mb-3
              mt-5
              font-semibold
              text-slate-200
            "
          >
            Rol
          </Text>


          <View
            className="flex-row"
          >

            <Pressable
              onPress={() =>
                setRol("usuario")
              }
              className={`
                mr-3
                flex-1
                items-center
                rounded-2xl
                border
                py-4

                ${
                  rol === "usuario"
                    ? "border-blue-500 bg-blue-950"
                    : "border-slate-700 bg-slate-900"
                }
              `}
            >

              <Text
                className={
                  rol === "usuario"
                    ? "font-semibold text-blue-300"
                    : "font-semibold text-slate-400"
                }
              >
                Usuario
              </Text>

            </Pressable>


            <Pressable
              onPress={() =>
                setRol("administrador")
              }
              className={`
                flex-1
                items-center
                rounded-2xl
                border
                py-4

                ${
                  rol === "administrador"
                    ? "border-blue-500 bg-blue-950"
                    : "border-slate-700 bg-slate-900"
                }
              `}
            >

              <Text
                className={
                  rol === "administrador"
                    ? "font-semibold text-blue-300"
                    : "font-semibold text-slate-400"
                }
              >
                Administrador
              </Text>

            </Pressable>

          </View>


          {/* ÁREA */}

          <Text
            className="
              mb-2
              mt-5
              font-semibold
              text-slate-200
            "
          >
            ID del área
          </Text>


          <TextInput
            value={areaId}
            onChangeText={setAreaId}
            keyboardType="number-pad"
            placeholder="Ej. 1"
            placeholderTextColor="#64748b"
            className="
              h-14
              rounded-2xl
              border
              border-slate-700
              bg-slate-900
              px-4
              text-white
            "
          />


          {/* HORARIO */}

          <Text
            className="
              mb-2
              mt-5
              font-semibold
              text-slate-200
            "
          >
            ID del horario
          </Text>


          <TextInput
            value={horarioId}
            onChangeText={setHorarioId}
            keyboardType="number-pad"
            placeholder="Ej. 1"
            placeholderTextColor="#64748b"
            className="
              h-14
              rounded-2xl
              border
              border-slate-700
              bg-slate-900
              px-4
              text-white
            "
          />


          {/* ROSTRO */}

          <Text
            className="
              mb-3
              mt-7
              font-semibold
              text-slate-200
            "
          >
            Rostro
          </Text>


          {fotoUri ? (

            <View>

              <Image
                source={{
                  uri: fotoUri
                }}
                style={{
                  width: "100%",
                  height: 320,
                  borderRadius: 24
                }}
                resizeMode="cover"
              />


              <Pressable
                onPress={
                  abrirCamara
                }
                className="
                  mt-4
                  h-12
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-slate-700
                "
              >

                <Text
                  className="
                    font-semibold
                    text-slate-300
                  "
                >
                  Tomar otra foto
                </Text>

              </Pressable>

            </View>

          ) : (

            <Pressable
              onPress={
                abrirCamara
              }
              className="
                h-40
                items-center
                justify-center
                rounded-3xl
                border-2
                border-dashed
                border-slate-700
                bg-slate-900
              "
            >

              <Text
                className="text-4xl"
              >
                📸
              </Text>


              <Text
                className="
                  mt-3
                  font-semibold
                  text-white
                "
              >
                Capturar rostro
              </Text>


              <Text
                className="
                  mt-1
                  text-sm
                  text-slate-500
                "
              >
                Usa la cámara frontal
              </Text>

            </Pressable>
          )}


          {/* ERROR */}

          {error ? (

            <View
              className="
                mt-6
                rounded-2xl
                border
                border-red-900
                bg-red-950
                p-4
              "
            >

              <Text
                className="text-red-300"
              >
                {error}
              </Text>

            </View>

          ) : null}


          {/* REGISTRAR */}

          <Pressable
            onPress={
              registrar
            }
            disabled={
              registrando
            }
            className={`
              mt-8
              h-14
              items-center
              justify-center
              rounded-2xl

              ${
                registrando
                  ? "bg-blue-900"
                  : "bg-blue-600"
              }
            `}
          >

            {registrando ? (

              <ActivityIndicator
                color="white"
              />

            ) : (

              <Text
                className="
                  text-base
                  font-bold
                  text-white
                "
              >
                Registrar usuario
              </Text>

            )}

          </Pressable>

        </ScrollView>

      </KeyboardAvoidingView>

    </SafeAreaView>
  );
}