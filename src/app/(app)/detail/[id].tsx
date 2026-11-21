// CODELAB 5 - UPDATE & DELETE (optimistic UI) - hanya pemilik laporan yang boleh mengubah
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Linking, Pressable, Text, View } from "react-native";
import { useAuth } from "../../../lib/auth";
import { Status, useStore, WARNA } from "../../../lib/store";

export default function Detail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { items, updateStatus, deleteItem } = useStore();
  const { user } = useAuth();
  const router = useRouter();
  const item = items.find((i) => i.id === id);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const kembali = () => {
    if (router.canGoBack()) router.back();
    else router.replace("/");
  };

  if (!item)
    return (
      <View style={{ padding: 20 }}>
        <Text>Barang tidak ditemukan.</Text>
        <Pressable onPress={kembali} style={{ marginTop: 12 }}>
          <Text style={{ color: "#1E3A8A", fontWeight: "700" }}>Kembali</Text>
        </Pressable>
      </View>
    );

  // Tombol ubah/hapus hanya untuk pemilik (RLS di server tetap jadi penjaga utama)
  const isOwner = item.userId === user?.id;

  const hubungi = () => {
    let no = item.kontak.replace(/\D/g, "");
    if (no.startsWith("0")) no = "62" + no.slice(1);
    const teks = encodeURIComponent(
      `Halo ${item.pelapor}, saya melihat laporan "${item.nama}" di NEMU.`,
    );
    Linking.openURL(`https://wa.me/${no}?text=${teks}`).catch(() =>
      setErrorMsg("Gagal membuka WhatsApp."),
    );
  };

  const ubahStatus = async (s: Status) => {
    setErrorMsg(null);
    try {
      await updateStatus(item.id, s);
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : "Gagal mengubah status.");
    }
  };

  const hapus = async () => {
    setErrorMsg(null);
    try {
      await deleteItem(item.id);
      kembali();
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : "Gagal menghapus laporan.");
    }
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
      <Stack.Screen options={{ title: item.nama }} />

      <Text style={{ fontSize: 22, fontWeight: "700" }}>{item.nama}</Text>
      <Text
        style={{ color: WARNA[item.status], fontWeight: "700", marginVertical: 8 }}
      >
        {item.status}
      </Text>
      {row("Kategori", item.kategori)}
      {row("Lokasi", item.lokasi)}
      {row("Tanggal", item.tanggal)}
      {row("Deskripsi", item.deskripsi || "-")}
      {row("Pelapor", item.pelapor)}

      <Pressable
        onPress={hubungi}
        style={{
          backgroundColor: "#16A34A",
          padding: 14,
          borderRadius: 10,
          alignItems: "center",
          marginTop: 16,
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "700" }}>Hubungi via WhatsApp</Text>
      </Pressable>

      {isOwner && (
        <>
          <Text style={{ fontWeight: "600", marginTop: 24, marginBottom: 8 }}>
            Ubah Status
          </Text>
          <View style={{ flexDirection: "row" }}>
            {opsi.map((s) => (
              <Pressable
                key={s}
                onPress={() => ubahStatus(s)}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderRadius: 20,
                  marginRight: 8,
                  backgroundColor: item.status === s ? WARNA[s] : "#E5E7EB",
                }}
              >
                <Text
                  style={{ color: item.status === s ? "#fff" : "#111", fontSize: 13 }}
                >
                  {s}
                </Text>
              </Pressable>
            ))}
          </View>

          <Pressable onPress={hapus} style={{ marginTop: 20, alignSelf: "flex-start" }}>
            <Text style={{ color: "#DC2626", fontWeight: "700" }}>Hapus laporan</Text>
          </Pressable>
        </>
      )}

      {errorMsg && (
        <Text style={{ color: "#B91C1C", marginTop: 12 }}>{errorMsg}</Text>
      )}

      <Pressable
        onPress={kembali}
        style={{ padding: 14, alignItems: "center", marginTop: 24 }}
      >
        <Text style={{ color: "#1E3A8A", fontWeight: "700" }}>Kembali ke Daftar</Text>
      </Pressable>
    </View>
  );
}
