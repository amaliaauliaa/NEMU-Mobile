import { View, Text, Pressable, Linking, Alert } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useStore, WARNA, Status } from "../../lib/store";

export default function Detail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { items, updateStatus } = useStore();
  const item = items.find((i) => i.id === id);
  if (!item) return <Text style={{ padding: 20 }}>Barang tidak ditemukan.</Text>;

  const hubungi = () => {
    let no = item.kontak.replace(/\D/g, "");
    if (no.startsWith("0")) no = "62" + no.slice(1);
    const teks = encodeURIComponent(`Halo ${item.pelapor}, saya melihat laporan "${item.nama}" di NEMU.`);
    Linking.openURL(`https://wa.me/${no}?text=${teks}`).catch(() => Alert.alert("Gagal membuka WhatsApp"));
  };

  const row = (k: string, v: string) => (
    <View style={{ flexDirection: "row", marginBottom: 8 }}>
      <Text style={{ width: 100, color: "#6B7280" }}>{k}</Text>
      <Text style={{ flex: 1 }}>{v}</Text>
    </View>
  );
  const opsi: Status[] = ["Hilang", "Ditemukan", "Sudah Kembali"];

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: "#F9FAFB" }}>
      <Text style={{ fontSize: 22, fontWeight: "700" }}>{item.nama}</Text>
      <Text style={{ color: WARNA[item.status], fontWeight: "700", marginVertical: 8 }}>{item.status}</Text>
      {row("Kategori", item.kategori)}
      {row("Lokasi", item.lokasi)}
      {row("Tanggal", item.tanggal)}
      {row("Deskripsi", item.deskripsi || "-")}
      {row("Pelapor", item.pelapor)}

      <Pressable onPress={hubungi} style={{ backgroundColor: "#16A34A", padding: 14, borderRadius: 10, alignItems: "center", marginTop: 16 }}>
        <Text style={{ color: "#fff", fontWeight: "700" }}>Hubungi via WhatsApp</Text>
      </Pressable>

      <Text style={{ fontWeight: "600", marginTop: 24, marginBottom: 8 }}>Ubah Status</Text>
      <View style={{ flexDirection: "row" }}>
        {opsi.map((s) => (
          <Pressable key={s} onPress={() => updateStatus(item.id, s)}
            style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, marginRight: 8,
              backgroundColor: item.status === s ? WARNA[s] : "#E5E7EB" }}>
            <Text style={{ color: item.status === s ? "#fff" : "#111", fontSize: 13 }}>{s}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
