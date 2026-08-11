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
  actualizarPermiso,
  eliminarPermiso,
  obtenerPermisos,
  Permiso
} from "../../../services/permisos";


export default function PermisosAdminScreen() {

  const [permisos, setPermisos] =
    useState<Permiso[]>([]);

  const [cargando, setCargando] =
    useState(true);

  const [actualizando, setActualizando] =
    useState(false);

  const [procesandoId, setProcesandoId] =
    useState<number | null>(null);

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
            await obtenerPermisos();

          setPermisos(datos);

        } catch (e) {

          setError(
            e instanceof Error
              ? e.message
              : "Error al obtener permisos"
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
  // CAMBIAR ESTADO
  // =====================================================

  const cambiarEstado = async (
    permiso: Permiso,
    estado: "aprobado" | "rechazado"
  ) => {

    try {

      setProcesandoId(
        permiso.id
      );


      await actualizarPermiso(
        permiso.id,
        {
          estado
        }
      );


      await cargarPermisos();


    } catch (e) {

      Alert.alert(
        "Error",
        e instanceof Error
          ? e.message
          : "No fue posible actualizar el permiso"
      );

    } finally {

      setProcesandoId(null);
    }
  };


  // =====================================================
  // ELIMINAR
  // =====================================================

  const confirmarEliminar = (
    permiso: Permiso
  ) => {

    Alert.alert(
      "Eliminar permiso",
      "¿Seguro que deseas eliminar esta solicitud?",
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

              setProcesandoId(
                permiso.id
              );


              await eliminarPermiso(
                permiso.id
              );


              await cargarPermisos();


            } catch (e) {

              Alert.alert(
                "Error",
                e instanceof Error
                  ? e.message
                  : "No fue posible eliminar el permiso"
              );

            } finally {

              setProcesandoId(null);
            }
          }
        }
      ]
    );
  };


  // =====================================================
  // COLOR DEL ESTADO
  // =====================================================

  const obtenerEstiloEstado = (
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
      obtenerEstiloEstado(
        item.estado
      );

    const procesando =
      procesandoId === item.id;


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

        {/* CABECERA */}

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
                text-slate-400
              "
            >
              Usuario ID #{item.usuario_id}
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


        {/* FECHAS */}

        <View
          className="
            mt-5
            rounded-2xl
            bg-slate-800
            p-4
          "
        >

          <Text className="text-slate-400">
            Desde
          </Text>

          <Text
            className="
              mt-1
              font-semibold
              text-white
            "
          >
            {item.fecha_inicio}
          </Text>


          <Text
            className="
              mt-4
              text-slate-400
            "
          >
            Hasta
          </Text>

          <Text
            className="
              mt-1
              font-semibold
              text-white
            "
          >
            {item.fecha_fin}
          </Text>

        </View>


        {/* MOTIVO */}

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


        {/* ACCIONES */}

        {item.estado === "pendiente" ? (

          <View
            className="
              mt-5
              flex-row
            "
          >

            <Pressable
              disabled={procesando}
              onPress={() =>
                cambiarEstado(
                  item,
                  "aprobado"
                )
              }
              className="
                mr-3
                flex-1
                items-center
                justify-center
                rounded-2xl
                bg-emerald-600
                py-3
              "
            >

              <Text
                className="
                  font-bold
                  text-white
                "
              >
                Aprobar
              </Text>

            </Pressable>


            <Pressable
              disabled={procesando}
              onPress={() =>
                cambiarEstado(
                  item,
                  "rechazado"
                )
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
                Rechazar
              </Text>

            </Pressable>

          </View>

        ) : null}


        <Pressable
          disabled={procesando}
          onPress={() =>
            confirmarEliminar(item)
          }
          className="
            mt-3
            items-center
            justify-center
            rounded-2xl
            border
            border-red-900
            py-3
          "
        >

          {procesando ? (

            <ActivityIndicator
              color="white"
            />

          ) : (

            <Text
              className="
                font-semibold
                text-red-400
              "
            >
              Eliminar
            </Text>

          )}

        </Pressable>

      </View>
    );
  };


  // =====================================================
  // PANTALLA
  // =====================================================

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
              text-base
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
          Permisos
        </Text>


        <Text
          className="
            mt-2
            text-slate-400
          "
        >
          {permisos.length} solicitudes
        </Text>

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


          <Text
            className="
              mt-4
              text-slate-400
            "
          >
            Cargando permisos...
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

            <Text
              className="
                font-bold
                text-white
              "
            >
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
                No hay solicitudes
              </Text>


              <Text
                className="
                  mt-2
                  text-center
                  text-slate-400
                "
              >
                Los permisos y vacaciones
                aparecerán aquí.
              </Text>

            </View>
          }
        />

      )}

    </SafeAreaView>
  );
}