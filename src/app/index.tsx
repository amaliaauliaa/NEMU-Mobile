import { DarkTheme, useNavigation, useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  FlatList,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import CampusWeatherCard from "../components/CampusWeatherCard";
import Chip from "../components/Chip";
import { KATEGORI, LOKASI, useStore, WARNA } from "../lib/store";
import { homeStyles } from "../styles/home";

export default function Home() {
  const { items } = useStore();
  const router = useRouter();
  const navigation = useNavigation();

  // useState
  const [q, setQ] = useState("");
  const [kat, setKat] = useState<string | null>(null);
  const [lok, setLok] = useState<string | null>(null);

  // useRef: referensi ke TextInput (tidak memicu re-render)
  const searchRef = useRef<TextInput>(null);

  // useMemo: filter hanya dihitung ulang kalau dependency berubah
  const data = useMemo(
    () =>
      items.filter(
        (i) =>
          i.nama.toLowerCase().includes(q.toLowerCase()) &&
          (!kat || i.kategori === kat) &&
          (!lok || i.lokasi === lok),
      ),
    [items, q, kat, lok],
  );

  // useMemo: ringkasan jumlah per status
  const ringkas = useMemo(
    () => ({
      hilang: items.filter((i) => i.status === "Hilang").length,
      ditemukan: items.filter((i) => i.status === "Ditemukan").length,
    }),
    [items],
  );

  // useEffect: update judul header setiap jumlah hasil berubah
  useEffect(() => {
    navigation.setOptions({ title: `NEMU (${data.length})` });
  }, [data.length, navigation]);

  const reset = () => {
    setQ("");
    setKat(null);
    setLok(null);
    searchRef.current?.focus(); // useRef dipakai di sini
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      <View style={{ padding: 12 }}>
        <View style={homeStyles.searchRow}>
          <TextInput
            ref={searchRef}
            placeholder="Cari barang..."
            value={q}
            onChangeText={setQ}
            style={homeStyles.searchInput}
          />
          <Pressable onPress={reset} style={homeStyles.resetButton}>
            <Text style={{ color: "#1E3A8A", fontWeight: "700" }}>Reset</Text>
          </Pressable>
        </View>

        <Text style={homeStyles.summary}>
          {ringkas.hilang} hilang • {ringkas.ditemukan} ditemukan
        </Text>

        <CampusWeatherCard />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={homeStyles.filterRow}
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
        contentContainerStyle={homeStyles.listContent}
        ListEmptyComponent={
          <Text style={homeStyles.emptyMessage}>Tidak ada barang.</Text>
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push(`/detail/${item.id}`)}
            style={homeStyles.itemCard}
          >
            <View style={homeStyles.itemHeader}>
              <Text style={homeStyles.itemName}>{item.nama}</Text>
              <Text
                style={[homeStyles.itemStatus, { color: WARNA[item.status] }]}
              >
                {item.status}
              </Text>
            </View>
            <Text style={homeStyles.itemMeta}>
              {item.kategori} • {item.lokasi} • {item.tanggal}
            </Text>
          </Pressable>
        )}
      />

      <Pressable
        onPress={() => router.push("/docs")}
        style={homeStyles.guideButton}
      >
        <Text style={homeStyles.actionText}>Panduan</Text>
      </Pressable>
      <Pressable
        onPress={() => router.push("/lapor")}
        style={homeStyles.floatingButton}
      >
        <Text style={homeStyles.actionText}>+ Lapor Barang</Text>
      </Pressable>
    </View>
  );
}
