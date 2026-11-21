// MODUL 4: store sekarang terhubung ke Supabase (tabel `laporan`) dan dilindungi RLS.
// API useStore() dijaga semirip mungkin dengan Modul 2 supaya layar lain tidak banyak berubah.
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth } from "./auth";
import { supabase } from "./supabase";

export type Status = "Hilang" | "Ditemukan" | "Sudah Kembali";
export type Item = {
  id: string;
  userId: string;
  nama: string;
  deskripsi: string;
  kategori: string;
  lokasi: string;
  status: Status;
  kontak: string;
  pelapor: string;
  tanggal: string;
};

export const KATEGORI = ["Dompet", "HP", "Kunci", "Tas", "Dokumen", "Lainnya"];
export const LOKASI = [
  "GKB 1",
  "GKB 2",
  "GKB 3",
  "GKB 4",
  "Perpustakaan",
  "Kantin",
  "Masjid",
  "Parkiran",
];
export const WARNA: Record<Status, string> = {
  Hilang: "#DC2626",
  Ditemukan: "#16A34A",
  "Sudah Kembali": "#6B7280",
};

// Bentuk baris di database (snake_case)
type Row = {
  id: string;
  user_id: string;
  nama: string;
  deskripsi: string | null;
  kategori: string;
  lokasi: string;
  status: Status;
  kontak: string;
  pelapor: string;
  created_at: string;
};

const fromRow = (r: Row): Item => ({
  id: r.id,
  userId: r.user_id,
  nama: r.nama,
  deskripsi: r.deskripsi ?? "",
  kategori: r.kategori,
  lokasi: r.lokasi,
  status: r.status,
  kontak: r.kontak,
  pelapor: r.pelapor,
  tanggal: r.created_at.slice(0, 10),
});

type NewItem = Omit<Item, "id" | "userId" | "tanggal">;

type Ctx = {
  items: Item[];
  isLoading: boolean; // loading pertama kali
  isRefreshing: boolean; // pull-to-refresh
  error: string | null;
  refresh: () => Promise<void>;
  addItem: (i: NewItem) => Promise<string>; // mengembalikan id, throw Error kalau gagal
  updateStatus: (id: string, s: Status) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
};
const StoreCtx = createContext<Ctx>(null!);
export const useStore = () => useContext(StoreCtx);

export function StoreProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const userId = user?.id;

  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // SELECT: ambil laporan, terbaru di atas. RLS yang menentukan baris mana yang boleh dilihat.
  const load = useCallback(
    async (mode: "initial" | "refresh") => {
      if (!userId) {
        setItems([]);
        return;
      }
      if (mode === "refresh") setIsRefreshing(true);
      else setIsLoading(true);
      setError(null);
      try {
        const { data, error: err } = await supabase
          .from("laporan")
          .select("*")
          .order("created_at", { ascending: false });
        if (err) setError(err.message);
        else setItems((data as Row[]).map(fromRow));
      } catch (e) {
        setError(e instanceof Error ? e.message : "Gagal memuat laporan.");
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [userId],
  );

  // Muat ulang tiap kali user berganti (login / logout / ganti akun)
  useEffect(() => {
    load("initial");
  }, [load]);

  const refresh = useCallback(() => load("refresh"), [load]);

  // INSERT: user_id WAJIB dari user yang sedang login (dicek lagi oleh RLS)
  const addItem: Ctx["addItem"] = async (i) => {
    if (!user) throw new Error("Kamu belum masuk.");
    const { data, error: err } = await supabase
      .from("laporan")
      .insert({ ...i, user_id: user.id })
      .select()
      .single();
    if (err) throw new Error(err.message);
    const item = fromRow(data as Row);
    setItems((p) => [item, ...p]);
    return item.id;
  };

  // UPDATE dengan Optimistic UI: ubah layar dulu, rollback kalau gagal
  const updateStatus: Ctx["updateStatus"] = async (id, s) => {
    const snapshot = items;
    setItems((p) => p.map((x) => (x.id === id ? { ...x, status: s } : x)));
    const { data, error: err } = await supabase
      .from("laporan")
      .update({ status: s })
      .eq("id", id)
      .select("id");
    // RLS yang menolak tidak melempar error, tapi 0 baris terubah
    if (err || !data || data.length === 0) {
      setItems(snapshot);
      throw new Error(err?.message ?? "Kamu tidak punya izin mengubah laporan ini.");
    }
  };

  // DELETE dengan Optimistic UI
  const deleteItem: Ctx["deleteItem"] = async (id) => {
    const snapshot = items;
    setItems((p) => p.filter((x) => x.id !== id));
    const { data, error: err } = await supabase
      .from("laporan")
      .delete()
      .eq("id", id)
      .select("id");
    if (err || !data || data.length === 0) {
      setItems(snapshot);
      throw new Error(err?.message ?? "Kamu tidak punya izin menghapus laporan ini.");
    }
  };

  return (
    <StoreCtx.Provider
      value={{
        items,
        isLoading,
        isRefreshing,
        error,
        refresh,
        addItem,
        updateStatus,
        deleteItem,
      }}
    >
      {children}
    </StoreCtx.Provider>
  );
}
