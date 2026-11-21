import { Stack } from "expo-router";
import { Pressable, Text } from "react-native";
import { useAuth } from "../../lib/auth";

export default function AppLayout() {
  const { signOut } = useAuth();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#1E3A8A" },
        headerTintColor: "#fff",
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "NEMU",
          headerRight: () => (
            <Pressable onPress={signOut} hitSlop={8}>
              <Text style={{ color: "#fff", fontWeight: "700" }}>Keluar</Text>
            </Pressable>
          ),
        }}
      />
      <Stack.Screen name="lapor" options={{ title: "Lapor Barang" }} />
      <Stack.Screen name="detail/[id]" options={{ title: "Detail Barang" }} />
      <Stack.Screen name="vault" options={{ title: "Brankas Token" }} />
      <Stack.Screen name="health" options={{ title: "Cek Koneksi Cloud" }} />
    </Stack>
  );
}
