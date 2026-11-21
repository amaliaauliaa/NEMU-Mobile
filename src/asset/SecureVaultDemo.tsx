// CODELAB 1 - The Encrypted Vault: simpan / ambil / hapus token dengan expo-secure-store
import * as SecureStore from "expo-secure-store";
import { useState } from "react";
import { Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

const TOKEN_KEY = "nemu_user_token";
const isWeb = Platform.OS === "web";

// SecureStore tidak ada di web -> fallback localStorage (khusus demo/testing)
async function saveToken(token: string) {
  if (isWeb) window.localStorage.setItem(TOKEN_KEY, token);
  else await SecureStore.setItemAsync(TOKEN_KEY, token);
}
async function loadToken(): Promise<string | null> {
  if (isWeb) return window.localStorage.getItem(TOKEN_KEY);
  return await SecureStore.getItemAsync(TOKEN_KEY);
}
async function wipeToken() {
  if (isWeb) window.localStorage.removeItem(TOKEN_KEY);
  else await SecureStore.deleteItemAsync(TOKEN_KEY);
}

export default function SecureVaultDemo() {
  const [input, setInput] = useState("");
  const [vaultValue, setVaultValue] = useState<string | null>(null);
  const [status, setStatus] = useState("Belum ada aksi.");

  const onSave = async () => {
    const token = input.trim();
    if (!token) return setStatus("Isi token dulu.");
    try {
      await saveToken(token);
      setInput("");
      setVaultValue(null);
      setStatus("Token tersimpan dengan aman.");
    } catch (e) {
      setStatus(`Gagal menyimpan: ${e instanceof Error ? e.message : e}`);
    }
  };

  const onLoad = async () => {
    try {
      const token = await loadToken();
      setVaultValue(token);
      setStatus(token ? "Token berhasil dimuat." : "Tidak ada token tersimpan.");
    } catch (e) {
      setStatus(`Gagal memuat: ${e instanceof Error ? e.message : e}`);
    }
  };

  const onWipe = async () => {
    try {
      await wipeToken();
      setVaultValue(null);
      setStatus("Token dihapus dari penyimpanan.");
    } catch (e) {
      setStatus(`Gagal menghapus: ${e instanceof Error ? e.message : e}`);
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <Text style={styles.title}>Brankas Token NEMU</Text>
        <Text style={styles.platform}>
          Penyimpanan: {isWeb ? "Web (localStorage, hanya untuk uji)" : "SecureStore (terenkripsi)"}
        </Text>

        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Masukkan token..."
          autoCapitalize="none"
          autoCorrect={false}
        />

        <Pressable style={[styles.btn, styles.primary]} onPress={onSave}>
          <Text style={styles.primaryText}>Simpan Token</Text>
        </Pressable>
        <Pressable style={styles.btn} onPress={onLoad}>
          <Text style={styles.btnText}>Muat Token</Text>
        </Pressable>
        <Pressable style={styles.btn} onPress={onWipe}>
          <Text style={styles.btnText}>Hapus Token</Text>
        </Pressable>

        <Text style={styles.status}>{status}</Text>
        {vaultValue !== null && (
          <View style={styles.vault}>
            <Text style={styles.vaultLabel}>Isi brankas</Text>
            <Text style={styles.vaultValue}>{vaultValue}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F9FAFB", justifyContent: "center", padding: 20 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 20,
  },
  title: { fontSize: 20, fontWeight: "700", color: "#111827" },
  platform: { color: "#6B7280", fontSize: 12, marginTop: 4, marginBottom: 16 },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    marginBottom: 12,
  },
  btn: {
    padding: 13,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "#E5E7EB",
    marginBottom: 8,
  },
  btnText: { fontWeight: "700", color: "#111827" },
  primary: { backgroundColor: "#1E3A8A" },
  primaryText: { fontWeight: "700", color: "#fff" },
  status: { color: "#4B5563", marginTop: 8, fontSize: 13 },
  vault: {
    marginTop: 12,
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  vaultLabel: { color: "#1E3A8A", fontSize: 11, fontWeight: "700" },
  vaultValue: { color: "#111827", fontWeight: "600", marginTop: 2 },
});
