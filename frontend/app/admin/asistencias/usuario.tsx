import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  TextInput,
  View
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
  Asistencia,
  obtenerAsistenciasUsuario,
  PeriodoAsistencia
} from "../../../services/asistencias";


export default function HistorialUsuarioScreen() {

  const [usuarioId, setUsuarioId] =
    useState("");

  const [periodo, setPeriodo] =
    useState<PeriodoAsistencia>("semana");

  const [asistencias, setAsistencias] =
    useState<Asistencia[]>([]);

  const [buscando, setBuscando] =
    useState(false);

  const [error, setError] =
    useState("");


  const buscar = async () => {

    setError("");


    const id =
      Number(usuarioId);


    if (
      Number.isNaN(id) ||
      id <= 0
    ) {

      setError(
        "Ingresa un ID de usuario válido"
      );

      return;
    }


    try {

      setBuscando(true);


      const datos =
        await obtenerAsistenciasUsuario(
          id,
          periodo
        );


      setAsistencias(datos);


    } catch (e) {

      setError(
        e instanceof Error
          ? e.message
          : "No fue posible consultar"
      );

    } finally {

      setBuscando(false);
    }
  };


  const BotonPeriodo = ({
    valor,
    texto
  }: {
    valor: PeriodoAsistencia;
    texto: string;
  }) => {

    const seleccionado =
      periodo === valor;


    return (

      <Pressable
        onPress={() =>
          setPeriodo(valor)
        }
        className={`
          flex-1
          items-center
          rounded-xl
          border
          py-3

          ${
            seleccionado
              ? "border-blue-500 bg-blue-950"
              : "border-slate-700 bg-slate-900"
          }
        `}
      >

        <Text
          className={
            seleccionado
              ? "font-semibold text-blue-300"
              : "font-semibold text-slate-400"
          }
        >
          {texto}
        </Text>

      </Pressable>
    );
  };


  return (

    <SafeAreaView
      className="flex-1 bg-slate-950"
    >

      <View className="px-6 pt-4">

        <Pressable
          onPress={() =>
            router.back()
          }
        >

          <Text className="font-semibold text-blue-500">
            ‹ Volver
          </Text>

        </Pressable>


        <Text
          className="
            mt-6
            text-3xl
            font-bold
            text-white
          "
        >
          Historial por usuario
        </Text>


        <Text className="mb-2 mt-6 font-semibold text-slate-200">
          ID del usuario
        </Text>


        <TextInput
          value={usuarioId}
          onChangeText={setUsuarioId}
          keyboardType="number-pad"
          placeholder="Ej. 4"
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


        <View className="mt-4 flex-row">

          <BotonPeriodo
            valor="semana"
            texto="Semana"
          />

          <View className="w-2" />

          <BotonPeriodo
            valor="mes"
            texto="Mes"
          />

          <View className="w-2" />

          <BotonPeriodo
            valor="año"
            texto="Año"
          />

        </View>


        <Pressable
          onPress={buscar}
          disabled={buscando}
          className="
            mt-4
            h-14
            items-center
            justify-center
            rounded-2xl
            bg-blue-600
          "
        >

          {buscando ? (

            <ActivityIndicator
              color="white"
            />

          ) : (

            <Text className="font-bold text-white">
              Buscar historial
            </Text>

          )}

        </Pressable>


        {error ? (

          <Text className="mt-4 text-red-400">
            {error}
          </Text>

        ) : null}

      </View>


      <FlatList
        data={asistencias}
        keyExtractor={(item) =>
          String(item.id)
        }
        contentContainerClassName="
          px-6
          pb-32
          pt-6
        "
        renderItem={({ item }) => (

          <View
            className="
              mb-3
              rounded-2xl
              bg-slate-900
              p-4
            "
          >

            <Text className="font-bold text-white">
              {item.fecha}
            </Text>

            <Text className="mt-2 text-slate-300">
              Entrada: {item.hora_entrada?.slice(0, 5) || "Sin registro"}
            </Text>

            <Text className="mt-1 text-slate-300">
              Salida: {item.hora_salida?.slice(0, 5) || "Sin registro"}
            </Text>

            <Text className="mt-1 text-slate-300">
              Estado: {item.estado}
            </Text>

            <Text className="mt-1 text-slate-500">
              Método: {item.metodo}
            </Text>

          </View>
        )}
        ListEmptyComponent={

          <Text
            className="
              mt-8
              text-center
              text-slate-500
            "
          >
            No hay resultados para mostrar.
          </Text>
        }
      />

    </SafeAreaView>
  );
}