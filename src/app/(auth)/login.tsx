// CODELAB 3 - Login & Register NEMU (Supabase Auth)
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { supabase } from "../../lib/supabase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nama, setNama] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);

  const handleAuth = async () => {
    if (loading) return; // cegah multiple submission

    // Sanitasi input: .trim() membuang spasi tak terlihat dari keyboard HP
    const cleanEmail = email.trim().toLowerCase();
    const cleanNama = nama.trim();

    if (!cleanEmail || !password) {
      setFeedback({ type: "error", text: "Email dan password wajib diisi." });
      return;
    }
    if (isRegistering && !cleanNama) {
      setFeedback({ type: "error", text: "Nama wajib diisi untuk mendaftar." });
      return;
    }
    if (password.length < 6) {
      setFeedback({ type: "error", text: "Password minimal 6 karakter." });
      return;
    }

    setLoading(true);
    setFeedback(null);
    try {
      if (isRegistering) {
        // REGISTER: nama disimpan sebagai metadata user
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: { data: { nama: cleanNama, role: "mahasiswa" } },
        });
        if (error) {
          setFeedback({ type: "error", text: error.message });
          return;
        }
        if (data.session) {
          // Confirm email OFF -> langsung login, guard di _layout yang mengarahkan ke Home
          setFeedback({ type: "success", text: `Pendaftaran berhasil. Halo, ${cleanNama}!` });
        } else {
          setFeedback({
            type: "success",
            text: "Pendaftaran berhasil. Cek email kamu untuk konfirmasi, lalu masuk.",
          });
          setIsRegistering(false);
        }
      } else {
        // LOGIN
        const { error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });
        if (error) {
          setFeedback({ type: "error", text: error.message });
          return;
        }
        // Sukses: onAuthStateChange -> AuthContext -> guard redirect ke "/"
      }
    } catch (e) {
      setFeedback({
        type: "error",
        text: e instanceof Error ? e.message : "Terjadi kesalahan jaringan.",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegistering((v) => !v);
    setFeedback(null);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#F9FAFB" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <Text style={styles.brand}>NEMU</Text>
          <Text style={styles.title}>
            {isRegistering ? "Buat akun baru" : "Masuk ke NEMU"}
          </Text>
          <Text style={styles.subtitle}>
            Laporkan dan temukan barang hilang di kampus UMM.
          </Text>

          {isRegistering && (
            <>
              <Text style={styles.label}>Nama</Text>
              <TextInput
                style={styles.input}
                value={nama}
                onChangeText={setNama}
                placeholder="cth: Budi Santoso"
                editable={!loading}
              />
            </>
          )}

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="kamu@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Minimal 6 karakter"
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}
            onSubmitEditing={handleAuth}
          />

          {feedback && (
            <Text
              style={[
                styles.feedback,
                feedback.type === "error" ? styles.error : styles.success,
              ]}
            >
              {feedback.text}
            </Text>
          )}

          <Pressable
            onPress={handleAuth}
            disabled={loading}
            style={[styles.button, loading && { opacity: 0.7 }]}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>
                {isRegistering ? "Daftar" : "Masuk"}
              </Text>
            )}
          </Pressable>

          <Pressable onPress={toggleMode} disabled={loading} style={styles.toggle}>
            <Text style={styles.toggleText}>
              {isRegistering
                ? "Sudah punya akun? Masuk di sini"
                : "Belum punya akun? Daftar di sini"}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, justifyContent: "center", padding: 20 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 20,
  },
  brand: { color: "#E07B39", fontWeight: "800", fontSize: 14, marginBottom: 4 },
  title: { fontSize: 22, fontWeight: "700", color: "#111827" },
  subtitle: { color: "#6B7280", marginTop: 4, marginBottom: 20 },
  label: { fontWeight: "600", marginBottom: 6 },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    marginBottom: 12,
  },
  feedback: { marginBottom: 12, fontSize: 13 },
  error: { color: "#B91C1C" },
  success: { color: "#15803D" },
  button: {
    backgroundColor: "#1E3A8A",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "700" },
  toggle: { alignItems: "center", marginTop: 14 },
  toggleText: { color: "#1E3A8A", fontWeight: "600" },
});
