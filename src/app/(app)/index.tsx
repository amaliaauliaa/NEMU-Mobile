// CODELAB 5 - Daftar laporan dari Supabase: loading, error, pull-to-refresh
import { useNavigation, useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import CampusWeatherCard from "../../components/CampusWeatherCard";
import Chip from "../../components/Chip";
import { useAuth } from "../../lib/auth";
import { KATEGORI, LOKASI, useStore, WARNA } from "../../lib/store";
import { homeStyles } from "../../styles/home";

export default function Home() {
  const { items, isLoading, isRefreshing, error, refresh } = useStore();
  const { user } = useAuth();
  const router = useRouter();
  const navigation = useNavigation();

  const [q, setQ] = useState("");
  const [kat, setKat] = useState<string | null>(null);
  const [lok, setLok] = useState<string | null>(null);

  const searchRef = useRef<TextInput>(null);

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

  const ringkas = useMemo(
    () => ({
      hilang: items.filter((i) => i.status === "Hilang").length,
      ditemukan: items.filter((i) => i.status === "Ditemukan").length,
    }),
    [items],
  );

  useEffect(() => {
    navigation.setOptions({ title: `NEMU (${data.length})` });
  }, [data.length, navigation]);

  const reset = () => {
    setQ("");
    setKat(null);
    setLok(null);
    searchRef.current?.focus();
  };

  const nama = (user?.user_metadata?.nama as string | undefined) ?? user?.email ?? "";

  return (
    <View style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      <View style={{ padding: 12 }}>
        <Text style={{ fontWeight: "700", marginBottom: 8, color: "#111827" }}>
          Halo, {nama}
        </Text>

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

        <View style={{ flexDirection: "row", marginTop: 4 }}>
          <Pressable onPress={() => router.push("/vault")} style={{ marginRight: 16 }}>
            <Text style={{ color: "#1E3A8A", fontWeight: "600" }}>Brankas Token</Text>
          </Pressable>
          <Pressable onPress={() => router.push("/health")}>
            <Text style={{ color: "#1E3A8A", fontWeight: "600" }}>Cek Koneksi Cloud</Text>
          </Pressable>
        </View>
      </View>

      <FlatList
        data={data}
        keyExtractor={(i) => i.id}
        contentContainerStyle={homeStyles.listContent}
        refreshing={isRefreshing}
        onRefresh={refresh}
        ListEmptyComponent={
          isLoading ? (
            <ActivityIndicator style={{ marginTop: 40 }} color="#1E3A8A" />
          ) : error ? (
            <View style={{ alignItems: "center", marginTop: 40 }}>
              <Text style={{ color: "#B91C1C", textAlign: "center" }}>
                Gagal memuat laporan: {error}
              </Text>
              <Pressable
                onPress={refresh}
                style={{
                  marginTop: 12,
                  backgroundColor: "#1E3A8A",
                  borderRadius: 8,
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "700" }}>Coba lagi</Text>
              </Pressable>
            </View>
          ) : (
            <Text style={homeStyles.emptyMessage}>
              Belum ada laporan. Tekan + Lapor Barang untuk menambahkan.
            </Text>
          )
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push(`/detail/${item.id}`)}
            style={homeStyles.itemCard}
          >
            <View style={homeStyles.itemHeader}>
              <Text style={homeStyles.itemName}>{item.nama}</Text>
              <Text style={[homeStyles.itemStatus, { color: WARNA[item.status] }]}>
                {item.status}
              </Text>
            </View>
            <Text style={homeStyles.itemMeta}>
              {item.kategori} • {item.lokasi} • {item.tanggal}
            </Text>
          </Pressable>
        )}
      />

      <Pressable onPress={() => router.push("/docs")} style={homeStyles.guideButton}>
        <Text style={homeStyles.actionText}>Panduan</Text>
      </Pressable>
      <Pressable onPress={() => router.push("/lapor")} style={homeStyles.floatingButton}>
        <Text style={homeStyles.actionText}>+ Lapor Barang</Text>
      </Pressable>
    </View>
  );
}
