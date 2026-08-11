import {
  ActivityIndicator,
  Alert,
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
  router,
  useLocalSearchParams
} from "expo-router";

import {
  useEffect,
  useState
} from "react";

import {
  actualizarPermiso,
  obtenerPermisoPorId
} from "../../../services/permisos";


export default function EditarPermisoScreen() {

  const { id } =
    useLocalSearchParams<{
      id: string;
    }>();

  const permisoId =
    Number(id);


  const [tipo, setTipo] =
    useState("permiso");

  const [fechaInicio, setFechaInicio] =
    useState("");

  const [fechaFin, setFechaFin] =
    useState("");

  const [motivo, setMotivo] =
    useState("");

  const [estado, setEstado] =
    useState("");

  const [cargando, setCargando] =
    useState(true);

  const [guardando, setGuardando] =
    useState(false);

  const [error, setError] =
    useState("");


  // =====================================================
  // CARGAR
  // =====================================================

  useEffect(() => {

    const cargar = async () => {

      try {

        setCargando(true);
        setError("");


        const permiso =
          await obtenerPermisoPorId(
            permisoId
          );


        setTipo(
          permiso.tipo
        );

        setFechaInicio(
          permiso.fecha_inicio
        );

        setFechaFin(
          permiso.fecha_fin
        );

        setMotivo(
          permiso.motivo ?? ""
        );

        setEstado(
          permiso.estado
        );


      } catch (e) {

        setError(
          e instanceof Error
            ? e.message
            : "No fue posible cargar la solicitud"
        );

      } finally {

        setCargando(false);
      }
    };


    cargar();

  }, [permisoId]);


  const fechaValida = (
    fecha: string
  ) => {

    return /^\d{4}-\d{2}-\d{2}$/.test(
      fecha
    );
  };


  // =====================================================
  // GUARDAR
  // =====================================================

  const guardar = async () => {

    setError("");


    if (estado !== "pendiente") {

      setError(
        "Esta solicitud ya fue procesada y no puede modificarse"
      );

      return;
    }


    if (!fechaValida(fechaInicio)) {

      setError(
        "Fecha de inicio inválida"
      );

      return;
    }


    if (!fechaValida(fechaFin)) {

      setError(
        "Fecha final inválida"
      );

      return;
    }


    if (
      new Date(fechaFin) <
      new Date(fechaInicio)
    ) {

      setError(
        "La fecha final no puede ser anterior a la inicial"
      );

      return;
    }


    try {

      setGuardando(true);


      await actualizarPermiso(
        permisoId,
        {
          tipo,

          fecha_inicio:
            fechaInicio,

          fecha_fin:
            fechaFin,

          motivo:
            motivo.trim()
        }
      );


      Alert.alert(
        "Solicitud actualizada",
        "Los cambios fueron guardados correctamente.",
        [
          {
            text: "Aceptar",
            onPress: () =>
              router.back()
          }
        ]
      );


    } catch (e) {

      setError(
        e instanceof Error
          ? e.message
          : "No fue posible guardar los cambios"
      );

    } finally {

      setGuardando(false);
    }
  };


  if (cargando) {

    return (

      <SafeAreaView
        className="flex-1 bg-slate-950"
      >

        <View
          className="
            flex-1
            items-center
            justify-center
          "
        >

          <ActivityIndicator
            size="large"
            color="white"
          />

        </View>

      </SafeAreaView>
    );
  }


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

          <Pressable
            onPress={() =>
              router.back()
            }
            className="mt-4"
          >

            <Text className="font-semibold text-blue-500">
              ‹ Volver
            </Text>

          </Pressable>


          <Text
            className="
              mt-7
              text-3xl
              font-bold
              text-white
            "
          >
            Editar solicitud
          </Text>


          <Text
            className="
              mt-2
              text-slate-400
            "
          >
            Solicitud #{permisoId}
          </Text>


          <View
            className="
              mt-5
              rounded-2xl
              bg-slate-900
              p-4
            "
          >

            <Text className="text-slate-400">
              Estado
            </Text>

            <Text
              className="
                mt-1
                font-bold
                text-white
              "
            >
              {estado}
            </Text>

          </View>


          <Text className="mb-3 mt-6 font-semibold text-slate-200">
            Tipo
          </Text>


          <View className="flex-row">

            <Pressable
              onPress={() =>
                setTipo("permiso")
              }
              className={`
                mr-3
                flex-1
                items-center
                rounded-2xl
                border
                py-4

                ${
                  tipo === "permiso"
                    ? "border-blue-500 bg-blue-950"
                    : "border-slate-700 bg-slate-900"
                }
              `}
            >

              <Text
                className={
                  tipo === "permiso"
                    ? "font-semibold text-blue-300"
                    : "font-semibold text-slate-400"
                }
              >
                Permiso
              </Text>

            </Pressable>


            <Pressable
              onPress={() =>
                setTipo("vacaciones")
              }
              className={`
                flex-1
                items-center
                rounded-2xl
                border
                py-4

                ${
                  tipo === "vacaciones"
                    ? "border-blue-500 bg-blue-950"
                    : "border-slate-700 bg-slate-900"
                }
              `}
            >

              <Text
                className={
                  tipo === "vacaciones"
                    ? "font-semibold text-blue-300"
                    : "font-semibold text-slate-400"
                }
              >
                Vacaciones
              </Text>

            </Pressable>

          </View>


          <Text className="mb-2 mt-6 font-semibold text-slate-200">
            Fecha de inicio
          </Text>

          <TextInput
            value={fechaInicio}
            onChangeText={setFechaInicio}
            placeholder="2026-08-20"
            placeholderTextColor="#64748b"
            maxLength={10}
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


          <Text className="mb-2 mt-5 font-semibold text-slate-200">
            Fecha final
          </Text>

          <TextInput
            value={fechaFin}
            onChangeText={setFechaFin}
            placeholder="2026-08-22"
            placeholderTextColor="#64748b"
            maxLength={10}
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


          <Text className="mb-2 mt-5 font-semibold text-slate-200">
            Motivo
          </Text>

          <TextInput
            value={motivo}
            onChangeText={setMotivo}
            placeholder="Motivo"
            placeholderTextColor="#64748b"
            multiline
            textAlignVertical="top"
            className="
              min-h-32
              rounded-2xl
              border
              border-slate-700
              bg-slate-900
              p-4
              text-white
            "
          />


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

              <Text className="text-red-300">
                {error}
              </Text>

            </View>

          ) : null}


          <Pressable
            onPress={guardar}
            disabled={
              guardando ||
              estado !== "pendiente"
            }
            className={`
              mt-8
              h-14
              items-center
              justify-center
              rounded-2xl

              ${
                estado !== "pendiente"
                  ? "bg-slate-700"
                  : guardando
                    ? "bg-blue-900"
                    : "bg-blue-600"
              }
            `}
          >

            {guardando ? (

              <ActivityIndicator
                color="white"
              />

            ) : (

              <Text
                className="
                  font-bold
                  text-white
                "
              >
                Guardar cambios
              </Text>

            )}

          </Pressable>

        </ScrollView>

      </KeyboardAvoidingView>

    </SafeAreaView>
  );
}