import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View
} from "react-native";

import {
  SafeAreaView
} from "react-native-safe-area-context";

import {
  router,
  useFocusEffect
} from "expo-router";

import {
  useCallback,
  useState
} from "react";

import {
  eliminarHorario,
  Horario,
  obtenerHorarios
} from "../../../services/horarios";


export default function HorariosScreen() {

  const [horarios, setHorarios] =
    useState<Horario[]>([]);

  const [cargando, setCargando] =
    useState(true);

  const [actualizando, setActualizando] =
    useState(false);

  const [error, setError] =
    useState("");


  const cargarHorarios =
    useCallback(
      async (
        esActualizacion = false
      ) => {

        try {

          if (esActualizacion) {
            setActualizando(true);
          } else {
            setCargando(true);
          }

          setError("");

          const datos =
            await obtenerHorarios();

          setHorarios(datos);

        } catch (e) {

          setError(
            e instanceof Error
              ? e.message
              : "Error al obtener horarios"
          );

        } finally {

          setCargando(false);
          setActualizando(false);
        }
      },
      []
    );


  useFocusEffect(
    useCallback(() => {

      cargarHorarios();

    }, [cargarHorarios])
  );


  const confirmarEliminar = (
    horario: Horario
  ) => {

    Alert.alert(
      "Eliminar horario",
      `¿Seguro que deseas eliminar "${horario.nombre}"?`,
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Eliminar",
          style: "destructive",

          onPress: async () => {

            try {

              await eliminarHorario(
                horario.id
              );

              await cargarHorarios();

            } catch (e) {

              Alert.alert(
                "Error",
                e instanceof Error
                  ? e.message
                  : "No fue posible eliminar el horario"
              );
            }
          }
        }
      ]
    );
  };


  const renderHorario = ({
    item
  }: {
    item: Horario
  }) => (

    <View
      className="
        mb-4
        rounded-3xl
        border
        border-slate-800
        bg-slate-900
        p-5
      "
    >

      <Text
        className="
          text-xl
          font-bold
          text-white
        "
      >
        {item.nombre}
      </Text>


      <View className="mt-4">

        <Text className="text-slate-400">
          Entrada
        </Text>

        <Text
          className="
            mt-1
            text-lg
            font-semibold
            text-white
          "
        >
          {item.hora_entrada?.slice(0, 5)}
        </Text>

      </View>


      <View className="mt-3">

        <Text className="text-slate-400">
          Salida
        </Text>

        <Text
          className="
            mt-1
            text-lg
            font-semibold
            text-white
          "
        >
          {item.hora_salida?.slice(0, 5)}
        </Text>

      </View>


      <View
        className="
          mt-4
          rounded-2xl
          bg-slate-800
          p-3
        "
      >

        <Text className="text-slate-300">
          Tolerancia: {item.tolerancia_minutos} minutos
        </Text>

      </View>


      <View
        className="
          mt-5
          flex-row
        "
      >

        <Pressable
          onPress={() =>
            router.push(
              `/admin/horarios/${item.id}` as any
            )
          }
          className="
            mr-3
            flex-1
            items-center
            rounded-2xl
            bg-blue-600
            py-3
          "
        >

          <Text
            className="
              font-bold
              text-white
            "
          >
            Editar
          </Text>

        </Pressable>


        <Pressable
          onPress={() =>
            confirmarEliminar(item)
          }
          className="
            flex-1
            items-center
            rounded-2xl
            bg-red-600
            py-3
          "
        >

          <Text
            className="
              font-bold
              text-white
            "
          >
            Eliminar
          </Text>

        </Pressable>

      </View>

    </View>
  );


  return (

    <SafeAreaView
      className="flex-1 bg-slate-950"
    >

      <View
        className="
          px-6
          pt-4
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
            mt-6
            text-3xl
            font-bold
            text-white
          "
        >
          Horarios
        </Text>


        <Text
          className="
            mt-2
            text-slate-400
          "
        >
          {horarios.length} registrados
        </Text>


        <Pressable
          onPress={() =>
            router.push(
              "/admin/horarios/crear" as any
            )
          }
          className="
            mt-5
            h-14
            items-center
            justify-center
            rounded-2xl
            bg-blue-600
          "
        >

          <Text
            className="
              font-bold
              text-white
            "
          >
            + Crear horario
          </Text>

        </Pressable>

      </View>


      {cargando ? (

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

          <Text className="mt-4 text-slate-400">
            Cargando horarios...
          </Text>

        </View>

      ) : error ? (

        <View
          className="
            flex-1
            justify-center
            px-6
          "
        >

          <Text className="text-red-400">
            {error}
          </Text>

        </View>

      ) : (

        <FlatList
          data={horarios}
          renderItem={renderHorario}
          keyExtractor={(item) =>
            String(item.id)
          }
          contentContainerClassName="
            px-6
            pb-32
            pt-6
          "
          refreshControl={
            <RefreshControl
              refreshing={actualizando}
              onRefresh={() =>
                cargarHorarios(true)
              }
              tintColor="white"
            />
          }
          ListEmptyComponent={

            <View
              className="
                mt-20
                items-center
              "
            >

              <Text className="text-5xl">
                🕐
              </Text>

              <Text
                className="
                  mt-4
                  text-xl
                  font-bold
                  text-white
                "
              >
                No hay horarios
              </Text>

            </View>
          }
        />

      )}

    </SafeAreaView>
  );
}