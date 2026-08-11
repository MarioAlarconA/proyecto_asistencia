import {
  ActivityIndicator,
  Alert,
  Pressable,
  Text,
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
  registrarEntradaFacial,
  registrarSalidaFacial
} from "../services/asistencias";


type Accion =
  | "entrada"
  | "salida"
  | null;


export default function AsistenciaFacial() {

  const cameraRef =
    useRef<CameraView | null>(null);


  const [
    permiso,
    solicitarPermiso
  ] = useCameraPermissions();


  const [accion, setAccion] =
    useState<Accion>(null);

  const [
    camaraActiva,
    setCamaraActiva
  ] = useState(false);

  const [
    camaraLista,
    setCamaraLista
  ] = useState(false);

  const [
    procesando,
    setProcesando
  ] = useState(false);

  const [
    errorCamara,
    setErrorCamara
  ] = useState("");


  // =====================================================
  // ABRIR CÁMARA
  // =====================================================

  const abrirCamara = async (
    tipo: "entrada" | "salida"
  ) => {

    setErrorCamara("");


    try {

      if (!permiso) {

        const resultado =
          await solicitarPermiso();


        if (!resultado.granted) {

          Alert.alert(
            "Permiso necesario",
            "Debes permitir el acceso a la cámara para registrar tu asistencia."
          );

          return;
        }

      } else if (!permiso.granted) {

        const resultado =
          await solicitarPermiso();


        if (!resultado.granted) {

          Alert.alert(
            "Permiso necesario",
            "Debes permitir el acceso a la cámara para registrar tu asistencia."
          );

          return;
        }
      }


      setAccion(tipo);
      setCamaraLista(false);
      setCamaraActiva(true);


    } catch (e) {

      Alert.alert(
        "Error",
        "No fue posible abrir la cámara."
      );
    }
  };


  // =====================================================
  // CERRAR CÁMARA
  // =====================================================

  const cerrarCamara = () => {

    if (procesando) {
      return;
    }

    setCamaraActiva(false);
    setCamaraLista(false);
    setAccion(null);
    setErrorCamara("");
  };


  // =====================================================
  // CAPTURAR Y ENVIAR
  // =====================================================

  const capturarRostro = async () => {

    if (
      !cameraRef.current ||
      !accion ||
      !camaraLista ||
      procesando
    ) {
      return;
    }


    try {

      setProcesando(true);


      const foto =
        await cameraRef.current
          .takePictureAsync({
            quality: 0.8
          });


      if (!foto?.uri) {

        throw new Error(
          "No fue posible capturar la fotografía"
        );
      }


      let resultado;


      if (accion === "entrada") {

        resultado =
          await registrarEntradaFacial(
            foto.uri
          );

      } else {

        resultado =
          await registrarSalidaFacial(
            foto.uri
          );
      }


      setCamaraActiva(false);
      setCamaraLista(false);
      setAccion(null);


      const usuarioTexto =
        resultado?.usuario_id
          ? `\nUsuario ID: ${resultado.usuario_id}`
          : "";


      Alert.alert(
        "Asistencia registrada",
        accion === "entrada"
          ? `Entrada registrada correctamente.${usuarioTexto}`
          : `Salida registrada correctamente.${usuarioTexto}`
      );


    } catch (e) {

      Alert.alert(
        "No se pudo registrar",
        e instanceof Error
          ? e.message
          : "No fue posible reconocer el rostro"
      );

    } finally {

      setProcesando(false);
    }
  };


  // =====================================================
  // CÁMARA
  // =====================================================

  if (camaraActiva) {

    return (

      <View
        className="flex-1 bg-black"
      >

        <CameraView
          ref={cameraRef}

          style={{
            flex: 1
          }}

          facing="front"

          mode="picture"

          onCameraReady={() => {
            setCamaraLista(true);
          }}

          onMountError={(evento) => {

            setErrorCamara(
              evento.message
            );

            setCamaraLista(false);
          }}
        />


        {/* OSCURECIDO SUPERIOR */}

        <View
          pointerEvents="none"
          className="
            absolute
            left-0
            right-0
            top-0
            items-center
            bg-black/40
            px-6
            pb-6
            pt-16
          "
        >

          <Text
            className="
              text-center
              text-2xl
              font-bold
              text-white
            "
          >
            {accion === "entrada"
              ? "Registrar entrada"
              : "Registrar salida"}
          </Text>


          <Text
            className="
              mt-2
              text-center
              text-white
            "
          >
            Coloca tu rostro dentro de la guía
          </Text>

        </View>


        {/* GUÍA DE ROSTRO */}

        <View
          pointerEvents="none"
          className="
            absolute
            inset-0
            items-center
            justify-center
          "
        >

          <View
            className="
              h-80
              w-64
              rounded-full
              border-4
              border-white
            "
          />

        </View>


        {/* ERROR DE CÁMARA */}

        {errorCamara ? (

          <View
            className="
              absolute
              left-6
              right-6
              top-40
              rounded-2xl
              bg-red-950
              p-4
            "
          >

            <Text
              className="
                text-center
                text-red-300
              "
            >
              {errorCamara}
            </Text>

          </View>

        ) : null}


        {/* PROCESANDO */}

        {procesando ? (

          <View
            className="
              absolute
              inset-0
              items-center
              justify-center
              bg-black/70
            "
          >

            <ActivityIndicator
              size="large"
              color="white"
            />


            <Text
              className="
                mt-5
                text-lg
                font-semibold
                text-white
              "
            >
              Reconociendo rostro...
            </Text>


            <Text
              className="
                mt-2
                text-center
                text-slate-300
              "
            >
              Comparando con los usuarios
              registrados
            </Text>

          </View>

        ) : null}


        {/* CONTROLES */}

        {!procesando ? (

          <View
            className="
              absolute
              bottom-10
              left-0
              right-0
              flex-row
              items-center
              justify-between
              px-8
            "
          >

            <Pressable
              onPress={
                cerrarCamara
              }
              className="
                h-14
                items-center
                justify-center
                rounded-full
                bg-black/70
                px-6
              "
            >

              <Text
                className="
                  font-bold
                  text-white
                "
              >
                Cancelar
              </Text>

            </Pressable>


            <Pressable
              onPress={
                capturarRostro
              }

              disabled={
                !camaraLista
              }

              className="
                h-20
                w-20
                items-center
                justify-center
                rounded-full
                border-4
                border-white
                bg-white/30
              "
            >

              {camaraLista ? (

                <View
                  className="
                    h-14
                    w-14
                    rounded-full
                    bg-white
                  "
                />

              ) : (

                <ActivityIndicator
                  color="white"
                />

              )}

            </Pressable>


            <View
              className="w-20"
            />

          </View>

        ) : null}

      </View>
    );
  }


  // =====================================================
  // MENÚ DE ENTRADA / SALIDA
  // =====================================================

  return (

    <SafeAreaView
      className="flex-1 bg-slate-950"
    >

      <View
        className="
          flex-1
          px-6
          pt-5
        "
      >

        <Pressable
          onPress={() =>
            router.back()
          }
        >

          <Text
            className="
              font-semibold
              text-blue-500
            "
          >
            ‹ Volver
          </Text>

        </Pressable>


        <Text
          className="
            mt-8
            text-3xl
            font-bold
            text-white
          "
        >
          Registrar asistencia
        </Text>


        <Text
          className="
            mt-3
            leading-6
            text-slate-400
          "
        >
          Selecciona la operación y verifica
          tu identidad mediante reconocimiento
          facial.
        </Text>


        {/* ENTRADA */}

        <Pressable
          onPress={() =>
            abrirCamara(
              "entrada"
            )
          }
          className="
            mt-10
            rounded-3xl
            border
            border-emerald-900
            bg-emerald-950
            p-6
          "
        >

          <Text
            className="text-4xl"
          >
            🟢
          </Text>


          <Text
            className="
              mt-4
              text-2xl
              font-bold
              text-white
            "
          >
            Registrar entrada
          </Text>


          <Text
            className="
              mt-2
              leading-5
              text-emerald-200
            "
          >
            Captura tu rostro para registrar
            la hora de entrada.
          </Text>

        </Pressable>


        {/* SALIDA */}

        <Pressable
          onPress={() =>
            abrirCamara(
              "salida"
            )
          }
          className="
            mt-5
            rounded-3xl
            border
            border-blue-900
            bg-blue-950
            p-6
          "
        >

          <Text
            className="text-4xl"
          >
            🔵
          </Text>


          <Text
            className="
              mt-4
              text-2xl
              font-bold
              text-white
            "
          >
            Registrar salida
          </Text>


          <Text
            className="
              mt-2
              leading-5
              text-blue-200
            "
          >
            Captura tu rostro para registrar
            la hora de salida.
          </Text>

        </Pressable>


        <View
          className="
            mt-8
            rounded-2xl
            border
            border-slate-800
            bg-slate-900
            p-4
          "
        >

          <Text
            className="
              text-sm
              leading-5
              text-slate-400
            "
          >
            Para obtener mejores resultados,
            coloca el rostro de frente, con buena
            iluminación y evita cubrir los ojos
            o el rostro.
          </Text>

        </View>

      </View>

    </SafeAreaView>
  );
}