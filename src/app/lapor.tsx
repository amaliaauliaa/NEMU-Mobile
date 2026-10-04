import { useState } from "react";
import { ScrollView, Text, TextInput, Pressable, Alert, View } from "react-native";
import { useRouter } from "expo-router";
import { useStore, KATEGORI, LOKASI, Status } from "../lib/store";
import Chip from "../components/Chip";

const input = { backgroundColor: "#fff", borderRadius: 10, padding: 12, borderWidth: 1, borderColor: "#D1D5DB", marginBottom: 12 } as const;
const label = { fontWeight: "600", marginBottom: 6 } as const;

export default function Lapor() {
  const { addItem } = useStore();
  const router = useRouter();
  const [status, setStatus] = useState<Status>("Hilang");
  const [nama, setNama] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [kategori, setKategori] = useState(KATEGORI[0]);
  const [lokasi, setLokasi] = useState(LOKASI[0]);
  const [pelapor, setPelapor] = useState("");
  const [kontak, setKontak] = useState("");

  const simpan = () => {
    if (!nama.trim() || !pelapor.trim() || kontak.replace(/\D/g, "").length < 9) {
      Alert.alert("Data belum lengkap", "Isi nama barang, nama kamu, dan nomor WhatsApp yang valid.");
      return;
    }
    addItem({ nama, deskripsi, kategori, lokasi, status, kontak, pelapor });
    router.back();
  };

  return (
    <ScrollView style={{ backgroundColor: "#F9FAFB" }} contentContainerStyle={{ padding: 16 }}>
      <Text style={label}>Jenis Laporan</Text>
      <View style={{ flexDirection: "row" }}>
        <Chip label="Kehilangan" active={status === "Hilang"} onPress={() => setStatus("Hilang")} />
        <Chip label="Menemukan" active={status === "Ditemukan"} onPress={() => setStatus("Ditemukan")} />
      </View>
      <Text style={label}>Nama Barang</Text>
      <TextInput style={input} value={nama} onChangeText={setNama} placeholder="cth: Dompet hitam" />
      <Text style={label}>Deskripsi</Text>
      <TextInput style={[input, { height: 90, textAlignVertical: "top" }]} multiline value={deskripsi}
        onChangeText={setDeskripsi} placeholder="Ciri-ciri barang" />
      <Text style={label}>Kategori</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {KATEGORI.map((k) => <Chip key={k} label={k} active={kategori === k} onPress={() => setKategori(k)} />)}
      </View>
      <Text style={label}>Lokasi</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {LOKASI.map((l) => <Chip key={l} label={l} active={lokasi === l} onPress={() => setLokasi(l)} />)}
      </View>
      <Text style={label}>Nama Kamu</Text>
      <TextInput style={input} value={pelapor} onChangeText={setPelapor} />
      <Text style={label}>No. WhatsApp</Text>
      <TextInput style={input} value={kontak} onChangeText={setKontak} keyboardType="phone-pad" placeholder="08xxxxxxxxxx" />
      <Pressable onPress={simpan} style={{ backgroundColor: "#1E3A8A", padding: 14, borderRadius: 10, alignItems: "center" }}>
        <Text style={{ color: "#fff", fontWeight: "700" }}>Kirim Laporan</Text>
      </Pressable>
    </ScrollView>
  );
}
