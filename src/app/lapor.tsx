import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import Chip from "../components/Chip";
import { KATEGORI, LOKASI, Status, useStore } from "../lib/store";

const input = {
  backgroundColor: "#fff",
  borderRadius: 10,
  padding: 12,
  borderWidth: 1,
  borderColor: "#D1D5DB",
  marginBottom: 12,
} as const;
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

  // STATE SUB-FORM
  const [subItems, setSubItems] = useState<string[]>([]);
  const [inputSub, setInputSub] = useState("");

  const tambahSubItem = () => {
    if (inputSub.trim()) {
      setSubItems([...subItems, inputSub]);
      setInputSub("");
    }
  };

  const namaRef = useRef<TextInput>(null);
  const deskripsiRef = useRef<TextInput>(null);
  const pelaporRef = useRef<TextInput>(null);
  const kontakRef = useRef<TextInput>(null);

  useEffect(() => {
    namaRef.current?.focus();
  }, []);

  const batal = () => {
    if (router.canGoBack()) router.back();
    else router.replace("/");
  };

  const simpan = () => {
    if (
      !nama.trim() ||
      !pelapor.trim() ||
      kontak.replace(/\D/g, "").length < 9
    ) {
      Alert.alert(
        "Data belum lengkap",
        "Isi nama barang, nama kamu, dan nomor WhatsApp yang valid.",
      );
      return;
    }

    const deskripsiLengkap =
      subItems.length > 0
        ? `${deskripsi}\n\nDetail Bawaan:\n- ${subItems.join("\n- ")}`
        : deskripsi;

    const id = addItem({
      nama,
      deskripsi: deskripsiLengkap,
      kategori,
      lokasi,
      status,
      kontak,
      pelapor,
    });
    router.replace(`/detail/${id}`);
  };

  return (
    <ScrollView
      style={{ backgroundColor: "#F9FAFB" }}
      contentContainerStyle={{ padding: 16 }}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={label}>Jenis Laporan</Text>
      <View style={{ flexDirection: "row" }}>
        <Chip
          label="Kehilangan"
          active={status === "Hilang"}
          onPress={() => setStatus("Hilang")}
        />
        <Chip
          label="Menemukan"
          active={status === "Ditemukan"}
          onPress={() => setStatus("Ditemukan")}
        />
      </View>

      <Text style={label}>Nama Barang</Text>
      <TextInput
        ref={namaRef}
        style={input}
        value={nama}
        onChangeText={setNama}
        placeholder="cth: Dompet hitam"
        returnKeyType="next"
        onSubmitEditing={() => deskripsiRef.current?.focus()}
      />

      <Text style={label}>Deskripsi</Text>
      <TextInput
        ref={deskripsiRef}
        style={[input, { height: 90, textAlignVertical: "top" }]}
        multiline
        value={deskripsi}
        onChangeText={setDeskripsi}
        placeholder="Ciri-ciri barang"
      />

      <Text style={label}>Isi Detail Barang Bawaan (Sub-Form)</Text>
      <View style={{ flexDirection: "row", marginBottom: 12 }}>
        <TextInput
          style={[input, { flex: 1, marginRight: 8, marginBottom: 0 }]}
          placeholder="Contoh: Kartu ATM, SIM"
          value={inputSub}
          onChangeText={setInputSub}
        />

        <Pressable
          onPress={tambahSubItem}
          style={{
            backgroundColor: "#1E3A8A",
            paddingHorizontal: 16,
            justifyContent: "center",
            borderRadius: 10,
            height: 48,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "700" }}>+ Tambah</Text>
        </Pressable>
      </View>

      {subItems.map((item, index) => (
        <Text
          key={index}
          style={{ color: "#374151", marginLeft: 8, marginBottom: 4 }}
        >
          • {item}
        </Text>
      ))}

      <Text style={[label, { marginTop: 12 }]}>Kategori</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {KATEGORI.map((k) => (
          <Chip
            key={k}
            label={k}
            active={kategori === k}
            onPress={() => setKategori(k)}
          />
        ))}
      </View>

      <Text style={label}>Lokasi</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {LOKASI.map((l) => (
          <Chip
            key={l}
            label={l}
            active={lokasi === l}
            onPress={() => setLokasi(l)}
          />
        ))}
      </View>

      <Text style={label}>Nama Kamu</Text>
      <TextInput
        ref={pelaporRef}
        style={input}
        value={pelapor}
        onChangeText={setPelapor}
        returnKeyType="next"
        onSubmitEditing={() => kontakRef.current?.focus()}
      />

      <Text style={label}>No. WhatsApp</Text>
      <TextInput
        ref={kontakRef}
        style={input}
        value={kontak}
        onChangeText={setKontak}
        keyboardType="phone-pad"
        placeholder="08xxxxxxxxxx"
      />

      <Pressable
        onPress={simpan}
        style={{
          backgroundColor: "#1E3A8A",
          padding: 14,
          borderRadius: 10,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "700" }}>Kirim Laporan</Text>
      </Pressable>

      <Pressable
        onPress={batal}
        style={{ padding: 14, alignItems: "center", marginTop: 6 }}
      >
        <Text style={{ color: "#6B7280", fontWeight: "600" }}>Batal</Text>
      </Pressable>
    </ScrollView>
  );
}
