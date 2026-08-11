import {
  Pressable,
  ScrollView,
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
  useAuth
} from "../../context/AuthContext";


export default function UsuarioScreen() {

  const {
    cerrarSesion
  } = useAuth();


  const salir = async () => {

    await cerrarSesion();
  };


  return (

    <SafeAreaView
      className="flex-1 bg-slate-950"
    >

      <ScrollView
        contentContainerClassName="
          px-6
          pb-12
        "
        showsVerticalScrollIndicator={false}
      >

        {/* ENCABEZADO */}

        <View
          className="
            mb-8
            mt-4
          "
        >

          <Text
            className="
              text-sm
              font-semibold
              uppercase
              tracking-wider
              text-blue-500
            "
          >
            Usuario
          </Text>


          <Text
            className="
              mt-2
              text-3xl
              font-bold
              text-white
            "
          >
            Mi asistencia
          </Text>


          <Text
            className="
              mt-2
              text-base
              leading-6
              text-slate-400
            "
          >
            Registra tu entrada o salida,
            consulta tu historial y administra
            tus permisos.
          </Text>

        </View>


        {/* REGISTRAR ASISTENCIA */}

        <Pressable
          onPress={() =>
            router.push(
              "/usuario/asistencia" as any
            )
          }
          className="
            mb-4
            rounded-3xl
            border
            border-blue-900
            bg-blue-950
            p-5
          "
        >

          <View
            className="
              flex-row
              items-center
              justify-between
            "
          >

            <View className="flex-1">

              <Text className="text-4xl">
                📸
              </Text>


              <Text
                className="
                  mt-3
                  text-xl
                  font-bold
                  text-white
                "
              >
                Registrar asistencia
              </Text>


              <Text
                className="
                  mt-2
                  text-sm
                  leading-5
                  text-blue-200
                "
              >
                Registra tu entrada o salida
                utilizando reconocimiento facial.
              </Text>

            </View>


            <Text
              className="
                ml-4
                text-3xl
                text-blue-400
              "
            >
              ›
            </Text>

          </View>

        </Pressable>


        {/* MIS ASISTENCIAS */}

        <Pressable
          onPress={() =>
            router.push(
              "/usuario/asistencias" as any
            )
          }
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
              items-center
              justify-between
            "
          >

            <View className="flex-1">

              <Text className="text-3xl">
                📋
              </Text>


              <Text
                className="
                  mt-3
                  text-xl
                  font-bold
                  text-white
                "
              >
                Mis asistencias
              </Text>


              <Text
                className="
                  mt-2
                  text-sm
                  leading-5
                  text-slate-400
                "
              >
                Consulta tus entradas,
                salidas, retardos y faltas.
              </Text>

            </View>


            <Text
              className="
                ml-4
                text-3xl
                text-slate-500
              "
            >
              ›
            </Text>

          </View>

        </Pressable>


        {/* MIS PERMISOS */}

        <Pressable
          onPress={() =>
            router.push(
              "/usuario/permisos" as any
            )
          }
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
              items-center
              justify-between
            "
          >

            <View className="flex-1">

              <Text className="text-3xl">
                🏖️
              </Text>


              <Text
                className="
                  mt-3
                  text-xl
                  font-bold
                  text-white
                "
              >
                Mis permisos
              </Text>


              <Text
                className="
                  mt-2
                  text-sm
                  leading-5
                  text-slate-400
                "
              >
                Solicita permisos o vacaciones
                y consulta su estado.
              </Text>

            </View>


            <Text
              className="
                ml-4
                text-3xl
                text-slate-500
              "
            >
              ›
            </Text>

          </View>

        </Pressable>


        {/* CERRAR SESIÓN */}

        <Pressable
          onPress={salir}
          className="
            mt-6
            h-14
            items-center
            justify-center
            rounded-2xl
            border
            border-red-900
            bg-red-950
          "
        >

          <Text
            className="
              text-base
              font-bold
              text-red-300
            "
          >
            Cerrar sesión
          </Text>

        </Pressable>

      </ScrollView>

    </SafeAreaView>
  );
}