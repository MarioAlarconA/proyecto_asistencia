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
  actualizarUsuario,
  obtenerUsuarioPorId
} from "../../../services/usuarios";


type Rol = "usuario" | "administrador";


export default function EditarUsuarioScreen() {

  const { id } = useLocalSearchParams<{
    id: string;
  }>();

  const usuarioId = Number(id);


  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [username, setUsername] = useState("");

  const [rol, setRol] =
    useState<Rol>("usuario");

  const [areaId, setAreaId] =
    useState("");

  const [horarioId, setHorarioId] =
    useState("");

  const [activo, setActivo] =
    useState(true);

  const [cargando, setCargando] =
    useState(true);

  const [guardando, setGuardando] =
    useState(false);

  const [error, setError] =
    useState("");


  // =====================================================
  // CARGAR USUARIO
  // =====================================================

  useEffect(() => {

    const cargarUsuario = async () => {

      try {

        setCargando(true);
        setError("");


        if (
          !usuarioId ||
          Number.isNaN(usuarioId)
        ) {
          throw new Error(
            "ID de usuario inválido"
          );
        }


        const usuario =
          await obtenerUsuarioPorId(
            usuarioId
          );


        setNombre(
          usuario.nombre ?? ""
        );

        setApellido(
          usuario.apellido ?? ""
        );

        setUsername(
          usuario.username ?? ""
        );

        setRol(
          usuario.rol
        );

        setAreaId(
          String(
            usuario.area_id ?? ""
          )
        );

        setHorarioId(
          String(
            usuario.horario_id ?? ""
          )
        );

        setActivo(
          usuario.activo
        );


      } catch (e) {

        if (e instanceof Error) {

          setError(
            e.message
          );

        } else {

          setError(
            "No fue posible cargar el usuario"
          );
        }

      } finally {

        setCargando(false);
      }
    };


    cargarUsuario();

  }, [usuarioId]);


  // =====================================================
  // GUARDAR CAMBIOS
  // =====================================================

  const guardarCambios = async () => {

    setError("");


    if (!nombre.trim()) {

      setError(
        "Ingresa el nombre"
      );

      return;
    }


    if (!apellido.trim()) {

      setError(
        "Ingresa el apellido"
      );

      return;
    }


    if (!username.trim()) {

      setError(
        "Ingresa el nombre de usuario"
      );

      return;
    }


    const area =
      Number(areaId);

    const horario =
      Number(horarioId);


    if (
      Number.isNaN(area) ||
      area <= 0
    ) {

      setError(
        "Ingresa un área válida"
      );

      return;
    }


    if (
      Number.isNaN(horario) ||
      horario <= 0
    ) {

      setError(
        "Ingresa un horario válido"
      );

      return;
    }


    try {

      setGuardando(true);


      await actualizarUsuario(
        usuarioId,
        {
          nombre:
            nombre.trim(),

          apellido:
            apellido.trim(),

          username:
            username.trim(),

          rol,

          area_id:
            area,

          horario_id:
            horario,

          activo
        }
      );


      Alert.alert(
        "Usuario actualizado",
        "Los cambios fueron guardados correctamente.",
        [
          {
            text: "Aceptar",

            onPress: () => {
              router.back();
            }
          }
        ]
      );


    } catch (e) {

      if (e instanceof Error) {

        setError(
          e.message
        );

      } else {

        setError(
          "No fue posible actualizar el usuario"
        );
      }

    } finally {

      setGuardando(false);
    }
  };


  // =====================================================
  // CARGANDO
  // =====================================================

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


          <Text
            className="
              mt-4
              text-slate-400
            "
          >
            Cargando usuario...
          </Text>

        </View>

      </SafeAreaView>
    );
  }


  // =====================================================
  // PANTALLA
  // =====================================================

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
          showsVerticalScrollIndicator={false}
        >

          {/* VOLVER */}

          <Pressable
            onPress={() =>
              router.back()
            }
            className="mt-4"
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


          {/* TÍTULO */}

          <Text
            className="
              mt-7
              text-3xl
              font-bold
              text-white
            "
          >
            Editar usuario
          </Text>


          <Text
            className="
              mt-2
              text-slate-400
            "
          >
            Usuario ID #{usuarioId}
          </Text>


          {/* ERROR */}

          {error ? (

            <View
              className="
                mt-6
                rounded-2xl
                border
                border-red-900
                bg-red-950
                p-4
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

          ) : null}


          {/* NOMBRE */}

          <Text
            className="
              mb-2
              mt-8
              font-semibold
              text-slate-200
            "
          >
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


          {/* APELLIDO */}

          <Text
            className="
              mb-2
              mt-5
              font-semibold
              text-slate-200
            "
          >
            Apellido
          </Text>


          <TextInput
            value={apellido}
            onChangeText={setApellido}
            placeholder="Apellido"
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


          {/* USERNAME */}

          <Text
            className="
              mb-2
              mt-5
              font-semibold
              text-slate-200
            "
          >
            Usuario
          </Text>


          <TextInput
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="Username"
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


          {/* ROL */}

          <Text
            className="
              mb-3
              mt-5
              font-semibold
              text-slate-200
            "
          >
            Rol
          </Text>


          <View
            className="flex-row"
          >

            <Pressable
              onPress={() =>
                setRol("usuario")
              }
              className={`
                mr-3
                flex-1
                items-center
                rounded-2xl
                border
                py-4

                ${
                  rol === "usuario"
                    ? "border-blue-500 bg-blue-950"
                    : "border-slate-700 bg-slate-900"
                }
              `}
            >

              <Text
                className={
                  rol === "usuario"
                    ? "font-semibold text-blue-300"
                    : "font-semibold text-slate-400"
                }
              >
                Usuario
              </Text>

            </Pressable>


            <Pressable
              onPress={() =>
                setRol(
                  "administrador"
                )
              }
              className={`
                flex-1
                items-center
                rounded-2xl
                border
                py-4

                ${
                  rol === "administrador"
                    ? "border-blue-500 bg-blue-950"
                    : "border-slate-700 bg-slate-900"
                }
              `}
            >

              <Text
                className={
                  rol === "administrador"
                    ? "font-semibold text-blue-300"
                    : "font-semibold text-slate-400"
                }
              >
                Administrador
              </Text>

            </Pressable>

          </View>


          {/* ÁREA */}

          <Text
            className="
              mb-2
              mt-5
              font-semibold
              text-slate-200
            "
          >
            ID del área
          </Text>


          <TextInput
            value={areaId}
            onChangeText={setAreaId}
            keyboardType="number-pad"
            placeholder="Ej. 1"
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


          {/* HORARIO */}

          <Text
            className="
              mb-2
              mt-5
              font-semibold
              text-slate-200
            "
          >
            ID del horario
          </Text>


          <TextInput
            value={horarioId}
            onChangeText={setHorarioId}
            keyboardType="number-pad"
            placeholder="Ej. 1"
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


          {/* ESTADO */}

          <Text
            className="
              mb-3
              mt-6
              font-semibold
              text-slate-200
            "
          >
            Estado
          </Text>


          <View
            className="flex-row"
          >

            <Pressable
              onPress={() =>
                setActivo(true)
              }
              className={`
                mr-3
                flex-1
                items-center
                rounded-2xl
                border
                py-4

                ${
                  activo
                    ? "border-emerald-500 bg-emerald-950"
                    : "border-slate-700 bg-slate-900"
                }
              `}
            >

              <Text
                className={
                  activo
                    ? "font-semibold text-emerald-300"
                    : "font-semibold text-slate-400"
                }
              >
                Activo
              </Text>

            </Pressable>


            <Pressable
              onPress={() =>
                setActivo(false)
              }
              className={`
                flex-1
                items-center
                rounded-2xl
                border
                py-4

                ${
                  !activo
                    ? "border-red-500 bg-red-950"
                    : "border-slate-700 bg-slate-900"
                }
              `}
            >

              <Text
                className={
                  !activo
                    ? "font-semibold text-red-300"
                    : "font-semibold text-slate-400"
                }
              >
                Inactivo
              </Text>

            </Pressable>

          </View>


          {/* GUARDAR */}

          <Pressable
            onPress={guardarCambios}
            disabled={guardando}
            className={`
              mt-8
              h-14
              items-center
              justify-center
              rounded-2xl

              ${
                guardando
                  ? "bg-blue-900"
                  : "bg-blue-600"
              }
            `}
          >

            {guardando ? (

              <ActivityIndicator
                color="white"
              />

            ) : (

              <Text
                className="
                  text-base
                  font-bold
                  text-white
                "
              >
                Guardar cambios
              </Text>

            )}

          </Pressable>

        </ScrollView>

      </KeyboardAvoidingView>

    </SafeAreaView>
  );
}