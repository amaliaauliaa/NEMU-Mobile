import { Stack, useRouter } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";

const guides = [
  {
    title: "Cara mencari barang",
    slug: ["fitur", "cari"],
    description: "Cari laporan berdasarkan nama, kategori, dan lokasi.",
  },
  {
    title: "Cara membuat laporan",
    slug: ["fitur", "lapor"],
    description: "Laporkan barang hilang atau barang yang ditemukan.",
  },
  {
    title: "Status dan kontak",
    slug: ["fitur", "status-dan-kontak"],
    description: "Perbarui status barang dan hubungi pelapor.",
  },
];

export default function Panduan() {
  const router = useRouter();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#F9FAFB" }}
      contentContainerStyle={{ padding: 16 }}
    >
      <Stack.Screen options={{ title: "Panduan NEMU" }} />
      <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 8 }}>
        Panduan NEMU
      </Text>
      <Text style={{ color: "#6B7280", marginBottom: 16 }}>
        Pilih topik untuk membuka halaman panduan. Halaman topik memakai
        catch-all route Expo Router.
      </Text>
      {guides.map((guide) => (
        <Pressable
          key={guide.slug.join("/")}
          onPress={() =>
            router.push({
              pathname: "/docs/[...slug]",
              params: { slug: guide.slug },
            })
          }
          style={{
            backgroundColor: "#fff",
            borderRadius: 12,
            borderWidth: 1,
            borderColor: "#E5E7EB",
            padding: 16,
            marginBottom: 10,
          }}
        >
          <Text style={{ color: "#1E3A8A", fontWeight: "700", fontSize: 16 }}>
            {guide.title}
          </Text>
          <Text style={{ color: "#6B7280", marginTop: 4 }}>
            {guide.description}
          </Text>
        </Pressable>
      ))}
      <View style={{ marginTop: 8 }}>
        <Text style={{ color: "#6B7280" }}>
          Contoh URL: /docs/fitur/cari
        </Text>
      </View>
    </ScrollView>
  );
}
