// CODELAB 4 - Root layout: AuthProvider + route guard (useSegments)
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { AuthProvider, useAuth } from "../lib/auth";
import { StoreProvider } from "../lib/store";

function RootGuard() {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  const inAuthGroup = segments[0] === "(auth)";

  useEffect(() => {
    // RULE 1: masih loading -> jangan redirect
    if (isLoading) return;

    if (!user && !inAuthGroup) {
      // RULE 2: belum login tapi masuk area app -> ke login
      router.replace("/login");
    } else if (user && inAuthGroup) {
      // RULE 3: sudah login tapi masih di halaman login -> ke app
      router.replace("/");
    }
    // RULE 4: logout -> user jadi null -> RULE 2 jalan otomatis
  }, [user, isLoading, inAuthGroup, router]);

  // Spinner tampil sampai status user PASTI dan posisi layar sudah benar
  // (mencegah "layout flickering"). Stack tetap dirender agar router siap.
  const ready = !isLoading && (user ? !inAuthGroup : inAuthGroup);

  return (
    <View style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }} />
      {!ready && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#1E3A8A" />
        </View>
      )}
    </View>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <StoreProvider>
        <RootGuard />
      </StoreProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#F9FAFB",
    alignItems: "center",
    justifyContent: "center",
  },
});
