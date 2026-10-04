import { Stack } from "expo-router";
import { StoreProvider } from "../lib/store";

export default function RootLayout() {
  return (
    <StoreProvider>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#1E3A8A" },
          headerTintColor: "#fff",
        }}
      >
        <Stack.Screen name="index" options={{ title: "NEMU" }} />
        <Stack.Screen name="lapor" options={{ title: "Lapor Barang" }} />
        <Stack.Screen name="detail/[id]" options={{ title: "Detail Barang" }} />
      </Stack>
    </StoreProvider>
  );
}
