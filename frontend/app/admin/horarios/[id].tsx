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
  actualizarHorario,
  obtenerHorarioPorId
} from "../../../services/horarios";


export default function EditarHorarioScreen() {

  const { id } =
    useLocalSearchParams<{
      id: string;
    }>();

  const horarioId =
    Number(id);


  const [nombre, setNombre] =
    useState("");

  const [entrada, setEntrada] =
    useState("");

  const [salida, setSalida] =
    useState("");

  const [tolerancia, setTolerancia] =
    useState("");

  const [cargando, setCargando] =
    useState(true);

  const [guardando, setGuardando] =
    useState(false);

  const [error, setError] =
    useState("");


  useEffect(() => {

    const cargar = async () => {

      try {

        const horario =
          await obtenerHorarioPorId(
            horarioId
          );

        setNombre(
          horario.nombre
        );

        setEntrada(
          horario.hora_entrada.slice(0, 5)
        );

        setSalida(
          horario.hora_salida.slice(0, 5)
        );

        setTolerancia(
          String(
            horario.tolerancia_minutos
          )
        );

      } catch (e) {

        setError(
          e instanceof Error
            ? e.message
            : "Error cargando horario"
        );

      } finally {

        setCargando(false);
      }
    };


    cargar();

  }, [horarioId]);


  const horaValida = (
    hora: string
  ) =>
    /^([01]\d|2[0-3]):[0-5]\d$/.test(
      hora
    );


  const guardar = async () => {

    setError("");


    if (!nombre.trim()) {

      setError(
        "Ingresa un nombre"
      );

      return;
    }


    if (!horaValida(entrada)) {

      setError(
        "Hora de entrada inválida"
      );

      return;
    }


    if (!horaValida(salida)) {

      setError(
        "Hora de salida inválida"
      );

      return;
    }


    const minutos =
      Number(tolerancia);


    if (
      Number.isNaN(minutos) ||
      minutos < 0
    ) {

      setError(
        "Tolerancia inválida"
      );

      return;
    }


    try {

      setGuardando(true);


      await actualizarHorario(
        horarioId,
        {
          nombre:
            nombre.trim(),

          hora_entrada:
            entrada,

          hora_salida:
            salida,

          tolerancia_minutos:
            minutos
        }
      );


      Alert.alert(
        "Horario actualizado",
        "Los cambios fueron guardados.",
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
          : "No fue posible guardar"
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
            Editar horario
          </Text>


          <Text className="mt-2 text-slate-400">
            Horario ID #{horarioId}
          </Text>


          <Text className="mb-2 mt-8 font-semibold text-slate-200">
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


          <Text className="mb-2 mt-5 font-semibold text-slate-200">
            Hora de entrada
          </Text>

          <TextInput
            value={entrada}
            onChangeText={setEntrada}
            placeholder="08:00"
            placeholderTextColor="#64748b"
            keyboardType="numbers-and-punctuation"
            maxLength={5}
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
            Hora de salida
          </Text>

          <TextInput
            value={salida}
            onChangeText={setSalida}
            placeholder="17:00"
            placeholderTextColor="#64748b"
            keyboardType="numbers-and-punctuation"
            maxLength={5}
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
            Tolerancia en minutos
          </Text>

          <TextInput
            value={tolerancia}
            onChangeText={setTolerancia}
            placeholder="10"
            placeholderTextColor="#64748b"
            keyboardType="number-pad"
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


          {error ? (

            <Text className="mt-5 text-red-400">
              {error}
            </Text>

          ) : null}


          <Pressable
            onPress={guardar}
            disabled={guardando}
            className="
              mt-8
              h-14
              items-center
              justify-center
              rounded-2xl
              bg-blue-600
            "
          >

            {guardando ? (

              <ActivityIndicator
                color="white"
              />

            ) : (

              <Text className="font-bold text-white">
                Guardar cambios
              </Text>

            )}

          </Pressable>

        </ScrollView>

      </KeyboardAvoidingView>

    </SafeAreaView>
  );
}