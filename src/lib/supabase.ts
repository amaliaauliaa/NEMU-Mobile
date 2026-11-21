// CODELAB 2 - Supabase client (singleton)
// Satu client dipakai seluruh app. URL & anon key dibaca dari .env (tidak di-hardcode).
import { createClient } from "@supabase/supabase-js";
import * as SecureStore from "expo-secure-store";
import { AppState, Platform } from "react-native";

export const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    "EXPO_PUBLIC_SUPABASE_URL / EXPO_PUBLIC_SUPABASE_ANON_KEY belum diisi di .env (lalu restart: npx expo start -c)",
  );
}

// SecureStore membatasi ~2KB per nilai, sedangkan session Supabase (JWT +
// refresh token + metadata) bisa lebih besar. Solusinya: pecah (chunk) nilai
// menjadi beberapa key. Tetap terenkripsi (iOS Keychain / Android Keystore),
// dan TIDAK memakai AsyncStorage.
const CHUNK_SIZE = 1800;

async function removeChunks(key: string) {
  const count = await SecureStore.getItemAsync(`${key}.count`);
  if (count !== null) {
    const n = parseInt(count, 10) || 0;
    for (let i = 0; i < n; i++) await SecureStore.deleteItemAsync(`${key}.${i}`);
  }
  await SecureStore.deleteItemAsync(`${key}.count`);
}

const ExpoSecureStoreAdapter = {
  getItem: async (key: string): Promise<string | null> => {
    const count = await SecureStore.getItemAsync(`${key}.count`);
    if (count === null) return null;
    const parts: string[] = [];
    for (let i = 0; i < (parseInt(count, 10) || 0); i++) {
      const part = await SecureStore.getItemAsync(`${key}.${i}`);
      if (part === null) return null; // data rusak -> anggap tidak ada session
      parts.push(part);
    }
    return parts.join("");
  },
  setItem: async (key: string, value: string): Promise<void> => {
    await removeChunks(key);
    const chunks: string[] = [];
    for (let i = 0; i < value.length; i += CHUNK_SIZE) {
      chunks.push(value.slice(i, i + CHUNK_SIZE));
    }
    if (chunks.length === 0) chunks.push("");
    await SecureStore.setItemAsync(`${key}.count`, String(chunks.length));
    for (let i = 0; i < chunks.length; i++) {
      await SecureStore.setItemAsync(`${key}.${i}`, chunks[i]);
    }
  },
  removeItem: async (key: string): Promise<void> => {
    await removeChunks(key);
  },
};

// Di web, SecureStore tidak tersedia -> pakai localStorage (hanya untuk testing)
const hasWindow = typeof window !== "undefined";
const WebStorageAdapter = {
  getItem: async (key: string) =>
    hasWindow ? window.localStorage.getItem(key) : null,
  setItem: async (key: string, value: string) => {
    if (hasWindow) window.localStorage.setItem(key, value);
  },
  removeItem: async (key: string) => {
    if (hasWindow) window.localStorage.removeItem(key);
  },
};

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: Platform.OS === "web" ? WebStorageAdapter : ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // wajib false di React Native
  },
});

// Refresh token hanya jalan saat app aktif (hemat baterai & data)
if (Platform.OS !== "web") {
  AppState.addEventListener("change", (state) => {
    if (state === "active") supabase.auth.startAutoRefresh();
    else supabase.auth.stopAutoRefresh();
  });
}
