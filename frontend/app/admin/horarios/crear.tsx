import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput
} from "react-native";

import {
  SafeAreaView
} from "react-native-safe-area-context";

import {
  router
} from "expo-router";

import {
  useState
} from "react";

import {
  crearHorario
} from "../../../services/horarios";


export default function CrearHorarioScreen() {

  const [nombre, setNombre] =
    useState("");

  const [entrada, setEntrada] =
    useState("");

  const [salida, setSalida] =
    useState("");

  const [tolerancia, setTolerancia] =
    useState("10");

  const [guardando, setGuardando] =
    useState(false);

  const [error, setError] =
    useState("");


  const horaValida = (
    hora: string
  ) => {

    return /^([01]\d|2[0-3]):[0-5]\d$/.test(
      hora
    );
  };


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
        "La hora de entrada debe tener formato HH:MM"
      );

      return;
    }


    if (!horaValida(salida)) {

      setError(
        "La hora de salida debe tener formato HH:MM"
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
        "Ingresa una tolerancia válida"
      );

      return;
    }


    try {

      setGuardando(true);


      await crearHorario({
        nombre:
          nombre.trim(),

        hora_entrada:
          entrada,

        hora_salida:
          salida,

        tolerancia_minutos:
          minutos
      });


      Alert.alert(
        "Horario creado",
        "El horario fue registrado correctamente.",
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
          : "No fue posible crear el horario"
      );

    } finally {

      setGuardando(false);
    }
  };


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
              mt-7
              text-3xl
              font-bold
              text-white
            "
          >
            Crear horario
          </Text>


          <Text
            className="
              mt-2
              text-slate-400
            "
          >
            Configura la jornada y tolerancia.
          </Text>


          <Text className="mb-2 mt-8 font-semibold text-slate-200">
            Nombre
          </Text>

          <TextInput
            value={nombre}
            onChangeText={setNombre}
            placeholder="Ej. Turno matutino"
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

            <Text
              className="
                mt-5
                text-red-400
              "
            >
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

              <Text
                className="
                  font-bold
                  text-white
                "
              >
                Crear horario
              </Text>

            )}

          </Pressable>

        </ScrollView>

      </KeyboardAvoidingView>

    </SafeAreaView>
  );
}