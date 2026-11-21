// CODELAB 2 - Cloud Bridge & System Health Check
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { SUPABASE_URL, supabase } from "../../lib/supabase";

export default function Health() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("Tekan tombol untuk menguji koneksi.");

  useEffect(() => {
    console.log("Supabase URL:", SUPABASE_URL);
  }, []);

  const test = async () => {
    setLoading(true);
    try {
      // head:true + count: hanya menghitung baris, tidak mengunduh datanya
      const { error, count } = await supabase
        .from("laporan")
        .select("id", { count: "exact", head: true });
      if (error) {
        // 42P01 / PGRST205 = tabel belum dibuat
        const missing = error.code === "42P01" || error.code === "PGRST205";
        setResult(
          missing
            ? "Terhubung ke Supabase, tetapi tabel 'laporan' belum dibuat. Jalankan supabase/schema.sql di SQL Editor."
            : `Database error: ${error.message}`,
        );
      } else {
        setResult(`Terhubung ke Supabase. Laporan yang bisa kamu lihat: ${count ?? 0}.`);
      }
    } catch (e) {
      setResult(`Database error: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <Text style={styles.title}>Supabase Health Check</Text>
        <Text style={styles.label}>URL tujuan</Text>
        <Text style={styles.url}>{SUPABASE_URL}</Text>

        <Pressable style={styles.btn} onPress={test} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Uji Koneksi Cloud</Text>}
        </Pressable>

        <Text style={styles.result}>{result}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F9FAFB", justifyContent: "center", padding: 20 },
  card: { backgroundColor: "#fff", borderRadius: 14, borderWidth: 1, borderColor: "#E5E7EB", padding: 20 },
  title: { fontSize: 20, fontWeight: "700", color: "#111827", marginBottom: 16 },
  label: { color: "#6B7280", fontSize: 12 },
  url: { fontWeight: "600", color: "#111827", marginBottom: 16 },
  btn: { backgroundColor: "#1E3A8A", padding: 14, borderRadius: 10, alignItems: "center" },
  btnText: { color: "#fff", fontWeight: "700" },
  result: { color: "#4B5563", marginTop: 14, fontSize: 13 },
});
