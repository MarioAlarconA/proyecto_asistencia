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
  obtenerUsuarios,
  eliminarUsuario,
  Usuario
} from "../../../services/usuarios";


export default function UsuariosScreen() {

  const [usuarios, setUsuarios] =
    useState<Usuario[]>([]);

  const [cargando, setCargando] =
    useState(true);

  const [actualizando, setActualizando] =
    useState(false);

  const [error, setError] =
    useState("");


  // =====================================================
  // CARGAR USUARIOS
  // =====================================================

  const cargarUsuarios =
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
            await obtenerUsuarios();

          setUsuarios(datos);

        } catch (e) {

          if (e instanceof Error) {

            setError(e.message);

          } else {

            setError(
              "Error al obtener usuarios"
            );
          }

        } finally {

          setCargando(false);
          setActualizando(false);
        }
      },
      []
    );


  // =====================================================
  // RECARGAR CADA VEZ QUE REGRESAMOS A LA PANTALLA
  // =====================================================

  useFocusEffect(
    useCallback(() => {

      cargarUsuarios();

    }, [cargarUsuarios])
  );


  // =====================================================
  // ELIMINAR USUARIO
  // =====================================================

  const confirmarEliminar = (
    usuario: Usuario
  ) => {

    Alert.alert(
      "Eliminar usuario",

      `¿Seguro que deseas eliminar a ${usuario.nombre} ${usuario.apellido}?`,

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

              await eliminarUsuario(
                usuario.id
              );

              Alert.alert(
                "Usuario eliminado",
                "El usuario fue eliminado correctamente."
              );

              await cargarUsuarios();

            } catch (e) {

              Alert.alert(
                "Error",

                e instanceof Error
                  ? e.message
                  : "No fue posible eliminar el usuario"
              );
            }
          }
        }
      ]
    );
  };


  // =====================================================
  // TARJETA DE USUARIO
  // =====================================================

  const renderUsuario = ({
    item
  }: {
    item: Usuario
  }) => {

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

        {/* NOMBRE Y ESTADO */}

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
                text-lg
                font-bold
                text-white
              "
            >
              {item.nombre} {item.apellido}
            </Text>


            <Text
              className="
                mt-1
                text-sm
                text-slate-400
              "
            >
              @{item.username}
            </Text>

          </View>


          <View
            className={`
              rounded-full
              px-3
              py-1

              ${item.activo
                ? "bg-emerald-950"
                : "bg-red-950"
              }
            `}
          >

            <Text
              className={`
                text-xs
                font-semibold

                ${item.activo
                  ? "text-emerald-400"
                  : "text-red-400"
                }
              `}
            >
              {
                item.activo
                  ? "Activo"
                  : "Inactivo"
              }
            </Text>

          </View>

        </View>


        {/* DATOS */}

        <View
          className="
            mt-5
            flex-row
            flex-wrap
          "
        >

          <View
            className="
              mb-2
              mr-2
              rounded-xl
              bg-slate-800
              px-3
              py-2
            "
          >

            <Text
              className="
                text-xs
                text-slate-300
              "
            >
              Rol: {item.rol}
            </Text>

          </View>


          <View
            className="
              mb-2
              mr-2
              rounded-xl
              bg-slate-800
              px-3
              py-2
            "
          >

            <Text
              className="
                text-xs
                text-slate-300
              "
            >
              Área: {item.area_id}
            </Text>

          </View>


          <View
            className="
              mb-2
              mr-2
              rounded-xl
              bg-slate-800
              px-3
              py-2
            "
          >

            <Text
              className="
                text-xs
                text-slate-300
              "
            >
              Horario: {item.horario_id}
            </Text>

          </View>

        </View>


        {/* ID Y ROSTRO */}

        <View
          className="
            mt-2
            border-t
            border-slate-800
            pt-4
          "
        >

          <Text
            className="
              text-xs
              text-slate-500
            "
          >
            ID #{item.id}

            {"  •  "}

            Rostro: {
              item.foto_rostro
                ? "registrado ✓"
                : "sin registrar"
            }
          </Text>

        </View>


        {/* BOTONES EDITAR Y ELIMINAR */}

        <View
          className="
            mt-5
            flex-row
          "
        >

          <Pressable
            onPress={() =>
              router.push(
                `/admin/usuarios/${item.id}` as any
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
          Usuarios
        </Text>


        <Text
          className="
            mt-2
            text-slate-400
          "
        >
          {usuarios.length} registrados
        </Text>


        {/* REGISTRAR USUARIO */}

        <Pressable
          onPress={() =>
            router.push(
              "/admin/usuarios/registrar"
            )
          }
          className="
            mt-5
            h-14
            flex-row
            items-center
            justify-center
            rounded-2xl
            bg-blue-600
          "
        >

          <Text
            className="
              mr-2
              text-2xl
              font-bold
              text-white
            "
          >
            +
          </Text>


          <Text
            className="
              text-base
              font-bold
              text-white
            "
          >
            Registrar usuario
          </Text>

        </Pressable>

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
            Cargando usuarios...
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
                font-semibold
                text-red-300
              "
            >
              {error}
            </Text>

          </View>


          <Pressable
            onPress={() =>
              cargarUsuarios()
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
          data={usuarios}

          renderItem={renderUsuario}

          keyExtractor={(item) =>
            String(item.id)
          }

          contentContainerClassName="
            px-6
            pb-32
            pt-6
          "

          showsVerticalScrollIndicator={
            false
          }

          refreshControl={

            <RefreshControl
              refreshing={
                actualizando
              }

              onRefresh={() =>
                cargarUsuarios(true)
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

              <Text
                className="text-5xl"
              >
                👥
              </Text>


              <Text
                className="
                  mt-5
                  text-xl
                  font-bold
                  text-white
                "
              >
                No hay usuarios
              </Text>


              <Text
                className="
                  mt-2
                  text-center
                  text-slate-400
                "
              >
                Todavía no existen usuarios
                registrados.
              </Text>

            </View>
          }
        />

      )}

    </SafeAreaView>
  );
}