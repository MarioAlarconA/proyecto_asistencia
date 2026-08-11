import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

import {
  SafeAreaView
} from "react-native-safe-area-context";

import {
  useState
} from "react";

import {
  router
} from "expo-router";

import {
  iniciarSesion
} from "../services/auth";

import {
  useAuth
} from "../context/AuthContext";


export default function LoginScreen() {

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [cargando, setCargando] =
    useState(false);

  const [error, setError] =
    useState("");

  const {
    establecerSesion
  } = useAuth();


  const manejarLogin = async () => {

    if (!username.trim()) {

      setError(
        "Ingresa tu nombre de usuario"
      );

      return;
    }

    if (!password) {

      setError(
        "Ingresa tu contraseña"
      );

      return;
    }

    try {

      setCargando(true);

      setError("");

      const datos = await iniciarSesion(
        username.trim(),
        password
      );

      establecerSesion(
        datos.access_token,
        datos.rol
      );

      if (datos.rol === "administrador") {
        router.replace("/admin");
      } else {
        router.replace("/usuario");
      }

    } catch (e) {

      if (e instanceof Error) {

        setError(e.message);

      } else {

        setError(
          "Error al iniciar sesión"
        );
      }

    } finally {

      setCargando(false);
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

        <View
          className="
            flex-1
            justify-center
            px-6
          "
        >

          {/* ENCABEZADO */}

          <View className="mb-10">

            <Text
              className="
                text-4xl
                font-bold
                text-white
              "
            >
              Bienvenido
            </Text>

            <Text
              className="
                mt-3
                text-base
                leading-6
                text-slate-400
              "
            >
              Inicia sesión para acceder
              al sistema de control de
              asistencia.
            </Text>

          </View>


          {/* FORMULARIO */}

          <View>

            <Text
              className="
                mb-2
                font-semibold
                text-slate-200
              "
            >
              Usuario
            </Text>

            <TextInput
              value={username}
              onChangeText={setUsername}
              placeholder="Ingresa tu usuario"
              placeholderTextColor="#64748b"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!cargando}
              className="
                h-14
                rounded-2xl
                border
                border-slate-700
                bg-slate-900
                px-4
                text-base
                text-white
              "
            />


            <Text
              className="
                mb-2
                mt-5
                font-semibold
                text-slate-200
              "
            >
              Contraseña
            </Text>

            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Ingresa tu contraseña"
              placeholderTextColor="#64748b"
              secureTextEntry
              editable={!cargando}
              onSubmitEditing={manejarLogin}
              className="
                h-14
                rounded-2xl
                border
                border-slate-700
                bg-slate-900
                px-4
                text-base
                text-white
              "
            />


            {/* ERROR */}

            {error ? (

              <View
                className="
                  mt-5
                  rounded-xl
                  border
                  border-red-900
                  bg-red-950
                  p-4
                "
              >

                <Text
                  className="
                    text-sm
                    text-red-300
                  "
                >
                  {error}
                </Text>

              </View>

            ) : null}


            {/* BOTÓN */}

            <Pressable
              onPress={manejarLogin}
              disabled={cargando}
              className={`
                mt-7
                h-14
                items-center
                justify-center
                rounded-2xl

                ${cargando
                  ? "bg-blue-800"
                  : "bg-blue-600"
                }
              `}
            >

              {cargando ? (

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
                  Iniciar sesión
                </Text>

              )}

            </Pressable>

          </View>


          {/* PIE */}

          <Text
            className="
              mt-10
              text-center
              text-sm
              text-slate-600
            "
          >
            Sistema de Control de Asistencia
          </Text>

        </View>

      </KeyboardAvoidingView>

    </SafeAreaView>
  );
}