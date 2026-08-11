import "../global.css";

import {
  Stack
} from "expo-router";

import {
  ActivityIndicator,
  View
} from "react-native";

import {
  AuthProvider,
  useAuth
} from "../context/AuthContext";


export default function RootLayout() {

  return (

    <AuthProvider>

      <NavegadorPrincipal />

    </AuthProvider>
  );
}


function NavegadorPrincipal() {

  const {
    token,
    rol,
    cargando
  } = useAuth();


  if (cargando) {

    return (

      <View
        className="
          flex-1
          items-center
          justify-center
          bg-slate-950
        "
      >

        <ActivityIndicator
          size="large"
          color="white"
        />

      </View>
    );
  }


  return (

    <Stack
      screenOptions={{
        headerShown: false
      }}
    >

      {/* LOGIN */}

      <Stack.Protected
        guard={!token}
      >

        <Stack.Screen
          name="index"
        />

      </Stack.Protected>


      {/* ADMINISTRADOR */}

      <Stack.Protected
        guard={
          !!token &&
          rol === "administrador"
        }
      >

        <Stack.Screen
          name="admin"
        />

      </Stack.Protected>


      {/* USUARIO */}

      <Stack.Protected
        guard={
          !!token &&
          rol === "usuario"
        }
      >

        <Stack.Screen
          name="usuario"
        />

      </Stack.Protected>

    </Stack>
  );
}