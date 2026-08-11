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
  eliminarPermiso,
  obtenerMisPermisos,
  Permiso
} from "../../../services/permisos";


export default function MisPermisosScreen() {

  const [permisos, setPermisos] =
    useState<Permiso[]>([]);

  const [cargando, setCargando] =
    useState(true);

  const [actualizando, setActualizando] =
    useState(false);

  const [error, setError] =
    useState("");


  // =====================================================
  // CARGAR PERMISOS
  // =====================================================

  const cargarPermisos =
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
            await obtenerMisPermisos();

          setPermisos(datos);

        } catch (e) {

          setError(
            e instanceof Error
              ? e.message
              : "Error al obtener tus permisos"
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

      cargarPermisos();

    }, [cargarPermisos])
  );


  // =====================================================
  // ELIMINAR
  // =====================================================

  const confirmarEliminar = (
    permiso: Permiso
  ) => {

    Alert.alert(
      "Eliminar solicitud",
      "¿Seguro que deseas eliminar este permiso?",
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

              await eliminarPermiso(
                permiso.id
              );

              await cargarPermisos();

            } catch (e) {

              Alert.alert(
                "Error",
                e instanceof Error
                  ? e.message
                  : "No fue posible eliminar"
              );
            }
          }
        }
      ]
    );
  };


  // =====================================================
  // ESTILO DEL ESTADO
  // =====================================================

  const estiloEstado = (
    estado: string
  ) => {

    if (estado === "aprobado") {

      return {
        caja:
          "bg-emerald-950 border-emerald-900",

        texto:
          "text-emerald-300"
      };
    }


    if (estado === "rechazado") {

      return {
        caja:
          "bg-red-950 border-red-900",

        texto:
          "text-red-300"
      };
    }


    return {
      caja:
        "bg-amber-950 border-amber-900",

      texto:
        "text-amber-300"
    };
  };


  // =====================================================
  // TARJETA
  // =====================================================

  const renderPermiso = ({
    item
  }: {
    item: Permiso;
  }) => {

    const estilo =
      estiloEstado(
        item.estado
      );


    return (

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

        <View
          className="
            flex-row
            items-start
            justify-between
          "
        >

          <View className="flex-1">

            <Text
              className="
                text-xl
                font-bold
                text-white
              "
            >
              {item.tipo}
            </Text>


            <Text
              className="
                mt-1
                text-sm
                text-slate-500
              "
            >
              Solicitud #{item.id}
            </Text>

          </View>


          <View
            className={`
              ml-3
              rounded-full
              border
              px-3
              py-1
              ${estilo.caja}
            `}
          >

            <Text
              className={`
                text-xs
                font-bold
                ${estilo.texto}
              `}
            >
              {item.estado}
            </Text>

          </View>

        </View>


        <View
          className="
            mt-5
            rounded-2xl
            bg-slate-800
            p-4
          "
        >

          <Text
            className="
              text-xs
              uppercase
              text-slate-500
            "
          >
            Periodo solicitado
          </Text>


          <Text
            className="
              mt-2
              font-semibold
              text-white
            "
          >
            {item.fecha_inicio}
          </Text>


          <Text
            className="
              my-1
              text-slate-500
            "
          >
            hasta
          </Text>


          <Text
            className="
              font-semibold
              text-white
            "
          >
            {item.fecha_fin}
          </Text>

        </View>


        <Text
          className="
            mt-5
            text-sm
            font-semibold
            text-slate-400
          "
        >
          Motivo
        </Text>


        <Text
          className="
            mt-2
            leading-5
            text-slate-200
          "
        >
          {item.motivo || "Sin motivo especificado"}
        </Text>


        {/* SOLO PENDIENTES SE PUEDEN MODIFICAR */}

        {item.estado === "pendiente" ? (

          <View
            className="
              mt-5
              flex-row
            "
          >

            <Pressable
              onPress={() =>
                router.push(
                  `/usuario/permisos/${item.id}` as any
                )
              }
              className="
                mr-3
                flex-1
                items-center
                justify-center
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
                justify-center
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

        ) : null}

      </View>
    );
  };


  return (

    <SafeAreaView
      className="flex-1 bg-slate-950"
    >

      {/* ENCABEZADO */}

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
          Mis permisos
        </Text>


        <Text
          className="
            mt-2
            text-slate-400
          "
        >
          {permisos.length} solicitudes
        </Text>


        <Pressable
          onPress={() =>
            router.push(
              "/usuario/permisos/crear" as any
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
            + Solicitar permiso
          </Text>

        </Pressable>

      </View>


      {/* CONTENIDO */}

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

          <Text
            className="
              mt-4
              text-slate-400
            "
          >
            Cargando solicitudes...
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

          <View
            className="
              rounded-2xl
              border
              border-red-900
              bg-red-950
              p-5
            "
          >

            <Text
              className="
                text-red-300
              "
            >
              {error}
            </Text>

          </View>


          <Pressable
            onPress={() =>
              cargarPermisos()
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

            <Text className="font-bold text-white">
              Intentar de nuevo
            </Text>

          </Pressable>

        </View>

      ) : (

        <FlatList
          data={permisos}
          renderItem={renderPermiso}
          keyExtractor={(item) =>
            String(item.id)
          }
          contentContainerClassName="
            px-6
            pb-32
            pt-6
          "
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={actualizando}
              onRefresh={() =>
                cargarPermisos(true)
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
                🏖️
              </Text>

              <Text
                className="
                  mt-5
                  text-xl
                  font-bold
                  text-white
                "
              >
                Sin solicitudes
              </Text>

              <Text
                className="
                  mt-2
                  text-center
                  text-slate-400
                "
              >
                Todavía no has solicitado
                permisos o vacaciones.
              </Text>

            </View>
          }
        />

      )}

    </SafeAreaView>
  );
}