import { useRouter } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import Chip from "../components/Chip";
import { KATEGORI, LOKASI, useStore, WARNA } from "../lib/store";

export default function Home() {
  const { items } = useStore();
  const router = useRouter();
  const [q, setQ] = useState("");
  const [kat, setKat] = useState<string | null>(null);
  const [lok, setLok] = useState<string | null>(null);

  const data = items.filter(
    (i) =>
      i.nama.toLowerCase().includes(q.toLowerCase()) &&
      (!kat || i.kategori === kat) &&
      (!lok || i.lokasi === lok),
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      <View style={{ padding: 12 }}>
        <TextInput
          placeholder="Cari barang..."
          value={q}
          onChangeText={setQ}
          style={{
            backgroundColor: "#fff",
            borderRadius: 10,
            padding: 12,
            borderWidth: 1,
            borderColor: "#D1D5DB",
          }}
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: 10 }}
        >
          {KATEGORI.map((k) => (
            <Chip
              key={k}
              label={k}
              active={kat === k}
              onPress={() => setKat(kat === k ? null : k)}
            />
          ))}
        </ScrollView>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {LOKASI.map((l) => (
            <Chip
              key={l}
              label={l}
              active={lok === l}
              onPress={() => setLok(lok === l ? null : l)}
            />
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={data}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ padding: 12, paddingBottom: 90 }}
        ListEmptyComponent={
          <Text
            style={{ textAlign: "center", color: "#6B7280", marginTop: 40 }}
          >
            Tidak ada barang.
          </Text>
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push(`/detail/${item.id}`)}
            style={{
              backgroundColor: "#fff",
              borderRadius: 12,
              padding: 14,
              marginBottom: 10,
              borderWidth: 1,
              borderColor: "#E5E7EB",
            }}
          >
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={{ fontWeight: "700", fontSize: 16 }}>
                {item.nama}
              </Text>
              <Text style={{ color: WARNA[item.status], fontWeight: "700" }}>
                {item.status}
              </Text>
            </View>
            <Text style={{ color: "#6B7280", marginTop: 4 }}>
              {item.kategori} • {item.lokasi} • {item.tanggal}
            </Text>
          </Pressable>
        )}
      />

      <Pressable
        onPress={() => router.push("/lapor")}
        style={{
          position: "absolute",
          right: 16,
          bottom: 24,
          backgroundColor: "#E07B39",
          paddingHorizontal: 20,
          paddingVertical: 14,
          borderRadius: 30,
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "700" }}>+ Lapor Barang</Text>
      </Pressable>
    </View>
  );
}
