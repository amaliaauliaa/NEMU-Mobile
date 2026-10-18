import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, ScrollView, Text } from "react-native";

const pages: Record<string, { title: string; body: string }> = {
  "fitur/cari": {
    title: "Cara mencari barang",
    body:
      "Gunakan kolom pencarian untuk mengetik nama barang. Pilih chip kategori atau lokasi untuk mempersempit hasil. Tekan Reset untuk menghapus pencarian dan filter.",
  },
  "fitur/lapor": {
    title: "Cara membuat laporan",
    body:
      "Tekan + Lapor Barang, pilih apakah barang hilang atau ditemukan, lalu isi nama barang, deskripsi, kategori, lokasi, nama pelapor, dan nomor WhatsApp. Tekan Kirim Laporan untuk menyimpan.",
  },
  "fitur/status-dan-kontak": {
    title: "Status dan kontak",
    body:
      "Buka sebuah laporan untuk melihat detail. Gunakan pilihan status untuk menandai barang sebagai Hilang, Ditemukan, atau Sudah Kembali. Tombol WhatsApp menyiapkan pesan untuk pelapor.",
  },
};

export default function PanduanTopik() {
  const { slug } = useLocalSearchParams<{ slug: string[] }>();
  const router = useRouter();
  const path = Array.isArray(slug) ? slug.join("/") : slug;
  const page = pages[path];

  const kembali = () => {
    if (router.canGoBack()) router.back();
    else router.replace("/docs");
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#F9FAFB" }}
      contentContainerStyle={{ padding: 16 }}
    >
      <Stack.Screen options={{ title: page?.title ?? "Panduan tidak ditemukan" }} />
      <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 12 }}>
        {page?.title ?? "Panduan tidak ditemukan"}
      </Text>
      <Text style={{ color: "#374151", lineHeight: 24 }}>
        {page?.body ?? `Topik "${path}" belum tersedia. Pilih panduan dari daftar.`}
      </Text>
      <Pressable
        onPress={kembali}
        style={{
          alignSelf: "flex-start",
          marginTop: 24,
          backgroundColor: "#1E3A8A",
          borderRadius: 10,
          paddingHorizontal: 16,
          paddingVertical: 12,
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "700" }}>Kembali</Text>
      </Pressable>
    </ScrollView>
  );
}
