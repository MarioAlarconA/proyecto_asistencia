import {
  Pressable,
  ScrollView,
  Text,
  View,
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


export default function AdminScreen() {

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
        contentContainerClassName="px-6 pb-10"
        showsVerticalScrollIndicator={false}
      >

        {/* ENCABEZADO */}

        <View className="mb-8 mt-4">

          <Text
            className="
              text-sm
              font-semibold
              uppercase
              tracking-wider
              text-blue-500
            "
          >
            Administrador
          </Text>

          <Text
            className="
              mt-2
              text-3xl
              font-bold
              text-white
            "
          >
            Panel de control
          </Text>

          <Text
            className="
              mt-2
              text-base
              leading-6
              text-slate-400
            "
          >
            Gestiona usuarios, asistencias,
            horarios y permisos.
          </Text>

        </View>


        {/* USUARIOS */}

        <Pressable
          onPress={() =>
            router.push("/admin/usuarios")
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
                
              </Text>

              <Text
                className="
                  mt-3
                  text-xl
                  font-bold
                  text-white
                "
              >
                Usuarios
              </Text>

              <Text
                className="
                  mt-1
                  text-sm
                  leading-5
                  text-slate-400
                "
              >
                Registrar, consultar,
                editar y eliminar usuarios.
              </Text>

            </View>

            <Text
              className="
                ml-4
                text-2xl
                text-slate-500
              "
            >
              ›
            </Text>

          </View>

        </Pressable>


        {/* ASISTENCIAS */}

        <Pressable
          onPress={() =>
            router.push("/admin/asistencias")
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
                
              </Text>

              <Text
                className="
                  mt-3
                  text-xl
                  font-bold
                  text-white
                "
              >
                Asistencias
              </Text>

              <Text
                className="
                  mt-1
                  text-sm
                  leading-5
                  text-slate-400
                "
              >
                Consulta las asistencias
                del día y los historiales.
              </Text>

            </View>

            <Text
              className="
                ml-4
                text-2xl
                text-slate-500
              "
            >
              ›
            </Text>

          </View>

        </Pressable>


        {/* HORARIOS */}

        <Pressable
          onPress={() =>
            router.push("/admin/horarios")
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
                
              </Text>

              <Text
                className="
                  mt-3
                  text-xl
                  font-bold
                  text-white
                "
              >
                Horarios
              </Text>

              <Text
                className="
                  mt-1
                  text-sm
                  leading-5
                  text-slate-400
                "
              >
                Crea y administra horarios
                y tolerancias.
              </Text>

            </View>

            <Text
              className="
                ml-4
                text-2xl
                text-slate-500
              "
            >
              ›
            </Text>

          </View>

        </Pressable>


        {/* PERMISOS */}

        <Pressable
          onPress={() =>
            router.push("/admin/permisos")
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
                
              </Text>

              <Text
                className="
                  mt-3
                  text-xl
                  font-bold
                  text-white
                "
              >
                Permisos
              </Text>

              <Text
                className="
                  mt-1
                  text-sm
                  leading-5
                  text-slate-400
                "
              >
                Consulta y administra
                permisos y vacaciones.
              </Text>

            </View>

            <Text
              className="
                ml-4
                text-2xl
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
            mt-5
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