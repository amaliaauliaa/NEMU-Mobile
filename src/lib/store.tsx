import { createContext, ReactNode, useContext, useState } from "react";

export type Status = "Hilang" | "Ditemukan" | "Sudah Kembali";
export type Item = {
  id: string;
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

const seed: Item[] = [
  {
    id: "1",
    nama: "Dompet Hitam",
    deskripsi: "Berisi KTM dan SIM atas nama Budi",
    kategori: "Dompet",
    lokasi: "Kantin",
    status: "Hilang",
    kontak: "081234567890",
    pelapor: "Budi",
    tanggal: "2026-10-01",
  },
  {
    id: "2",
    nama: "Kunci Motor Honda",
    deskripsi: "Gantungan kunci warna biru",
    kategori: "Kunci",
    lokasi: "Parkiran",
    status: "Ditemukan",
    kontak: "089876543210",
    pelapor: "Sari",
    tanggal: "2026-10-02",
  },
];

type Ctx = {
  items: Item[];
  addItem: (i: Omit<Item, "id" | "tanggal">) => void;
  updateStatus: (id: string, s: Status) => void;
};
const StoreCtx = createContext<Ctx>(null!);
export const useStore = () => useContext(StoreCtx);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Item[]>(seed);
  const addItem: Ctx["addItem"] = (i) =>
    setItems((p) => [
      {
        ...i,
        id: Date.now().toString(),
        tanggal: new Date().toISOString().slice(0, 10),
      },
      ...p,
    ]);
  const updateStatus: Ctx["updateStatus"] = (id, s) =>
    setItems((p) => p.map((x) => (x.id === id ? { ...x, status: s } : x)));
  return (
    <StoreCtx.Provider value={{ items, addItem, updateStatus }}>
      {children}
    </StoreCtx.Provider>
  );
}
