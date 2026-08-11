import {
  ActivityIndicator,
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
  router
} from "expo-router";

import {
  useCallback,
  useEffect,
  useState
} from "react";

import {
  Asistencia,
  obtenerMisAsistencias,
  PeriodoAsistencia
} from "../../../services/asistencias";


export default function MisAsistenciasScreen() {

  const [periodo, setPeriodo] =
    useState<PeriodoAsistencia>("semana");

  const [asistencias, setAsistencias] =
    useState<Asistencia[]>([]);

  const [cargando, setCargando] =
    useState(true);

  const [actualizando, setActualizando] =
    useState(false);

  const [error, setError] =
    useState("");


  // =====================================================
  // CARGAR ASISTENCIAS
  // =====================================================

  const cargarAsistencias =
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
            await obtenerMisAsistencias(
              periodo
            );


          setAsistencias(datos);


        } catch (e) {

          setError(
            e instanceof Error
              ? e.message
              : "Error al obtener asistencias"
          );

        } finally {

          setCargando(false);
          setActualizando(false);
        }
      },
      [periodo]
    );


  useEffect(() => {

    cargarAsistencias();

  }, [cargarAsistencias]);


  // =====================================================
  // FORMATEAR HORA
  // =====================================================

  const formatearHora = (
    hora: string | null
  ) => {

    if (!hora) {
      return "Sin registro";
    }

    return hora.slice(0, 5);
  };


  // =====================================================
  // ESTILO SEGÚN ESTADO
  // =====================================================

  const estiloEstado = (
    estado: string
  ) => {

    const valor =
      estado.toLowerCase();


    if (valor === "presente") {

      return {
        caja:
          "bg-emerald-950 border-emerald-900",

        texto:
          "text-emerald-300"
      };
    }


    if (valor === "retardo") {

      return {
        caja:
          "bg-amber-950 border-amber-900",

        texto:
          "text-amber-300"
      };
    }


    if (valor === "falta") {

      return {
        caja:
          "bg-red-950 border-red-900",

        texto:
          "text-red-300"
      };
    }


    if (
      valor === "permiso" ||
      valor === "vacaciones"
    ) {

      return {
        caja:
          "bg-blue-950 border-blue-900",

        texto:
          "text-blue-300"
      };
    }


    return {
      caja:
        "bg-slate-800 border-slate-700",

      texto:
        "text-slate-300"
    };
  };


  // =====================================================
  // TARJETA
  // =====================================================

  const renderAsistencia = ({
    item
  }: {
    item: Asistencia;
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

        {/* FECHA Y ESTADO */}

        <View
          className="
            flex-row
            items-center
            justify-between
          "
        >

          <View>

            <Text
              className="
                text-sm
                text-slate-500
              "
            >
              Fecha
            </Text>


            <Text
              className="
                mt-1
                text-lg
                font-bold
                text-white
              "
            >
              {item.fecha}
            </Text>

          </View>


          <View
            className={`
              rounded-full
              border
              px-3
              py-2
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


        {/* ENTRADA Y SALIDA */}

        <View
          className="
            mt-5
            flex-row
          "
        >

          <View
            className="
              mr-3
              flex-1
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
              Entrada
            </Text>


            <Text
              className="
                mt-2
                text-lg
                font-bold
                text-white
              "
            >
              {formatearHora(
                item.hora_entrada
              )}
            </Text>

          </View>


          <View
            className="
              flex-1
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
              Salida
            </Text>


            <Text
              className="
                mt-2
                text-lg
                font-bold
                text-white
              "
            >
              {formatearHora(
                item.hora_salida
              )}
            </Text>

          </View>

        </View>


        {/* MÉTODO */}

        <View
          className="
            mt-4
            border-t
            border-slate-800
            pt-4
          "
        >

          <Text
            className="
              text-sm
              text-slate-400
            "
          >
            Método:
            {" "}
            {item.metodo}
          </Text>

        </View>

      </View>
    );
  };


  // =====================================================
  // BOTÓN DE FILTRO
  // =====================================================

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
          justify-center
          rounded-2xl
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


  // =====================================================
  // PANTALLA
  // =====================================================

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
          Mis asistencias
        </Text>


        <Text
          className="
            mt-2
            text-slate-400
          "
        >
          Consulta tu historial de asistencia.
        </Text>


        {/* FILTROS */}

        <View
          className="
            mt-6
            flex-row
          "
        >

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


        <Text
          className="
            mt-4
            text-sm
            text-slate-500
          "
        >
          {asistencias.length}
          {" "}
          registros encontrados
        </Text>

      </View>


      {/* CARGANDO */}

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
            Cargando asistencias...
          </Text>

        </View>

      ) : error ? (

        /* ERROR */

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
              cargarAsistencias()
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

        /* LISTA */

        <FlatList
          data={asistencias}
          renderItem={renderAsistencia}
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
                cargarAsistencias(true)
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
                📋
              </Text>


              <Text
                className="
                  mt-5
                  text-xl
                  font-bold
                  text-white
                "
              >
                Sin registros
              </Text>


              <Text
                className="
                  mt-2
                  text-center
                  leading-5
                  text-slate-400
                "
              >
                No tienes asistencias
                registradas para este periodo.
              </Text>

            </View>
          }
        />

      )}

    </SafeAreaView>
  );
}