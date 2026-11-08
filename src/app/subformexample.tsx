import { useState } from "react";
import {
    Alert,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

// Tipe data untuk form di dalam (sub-form)
type SubItem = {
  id: string;
  nama: string;
  jumlah: string;
};

export default function LaporWithSubForm() {
  // State Form Utama
  const [namaLaporan, setNamaLaporan] = useState("");
  const [lokasi, setLokasi] = useState("");

  // State Form Dalam (Sub-Form / List Dinamis)
  const [subItems, setSubItems] = useState<SubItem[]>([]);

  // State Modal & Input Sub-Form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [namaSubItem, setNamaSubItem] = useState("");
  const [jumlahSubItem, setJumlahSubItem] = useState("1");

  // Fungsi menambah item dari Sub-Form ke Form Utama
  const tambahSubItem = () => {
    if (!namaSubItem.trim()) {
      Alert.alert("Peringatan", "Nama item tambahan tidak boleh kosong!");
      return;
    }

    const itemBaru: SubItem = {
      id: Date.now().toString(),
      nama: namaSubItem,
      jumlah: jumlahSubItem,
    };

    setSubItems((prev) => [...prev, itemBaru]);

    // Reset input sub-form & tutup modal
    setNamaSubItem("");
    setJumlahSubItem("1");
    setIsModalOpen(false);
  };

  // Fungsi hapus item dari Sub-Form
  const hapusSubItem = (id: string) => {
    setSubItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Form Laporan Utama</Text>

      {/* Input Form Utama */}
      <Text style={styles.label}>Nama Laporan</Text>
      <TextInput
        style={styles.input}
        value={namaLaporan}
        onChangeText={setNamaLaporan}
        placeholder="Contoh: Kehilangan Tas"
      />

      <Text style={styles.label}>Lokasi Kejadian</Text>
      <TextInput
        style={styles.input}
        value={lokasi}
        onChangeText={setLokasi}
        placeholder="Contoh: Gedung A"
      />

      {/* SECTION FORM INSIDE A FORM */}
      <View style={styles.subFormContainer}>
        <View style={styles.subFormHeader}>
          <Text style={styles.subFormTitle}>Detail Isi Barang (Sub-Form)</Text>

          {/* BUTTON UNTUK MEMBUKA FORM DALAM */}
          <Pressable
            style={styles.btnTambahSub}
            onPress={() => setIsModalOpen(true)}
          >
            <Text style={styles.btnTambahSubText}>+ Sub-Item</Text>
          </Pressable>
        </View>

        {/* Daftar item yang sudah ditambahkan lewat sub-form */}
        {subItems.length === 0 ? (
          <Text style={styles.emptyText}>Belum ada detail barang.</Text>
        ) : (
          subItems.map((item) => (
            <View key={item.id} style={styles.itemRow}>
              <Text style={styles.itemText}>
                {item.nama} ({item.jumlah} pcs)
              </Text>
              <Pressable onPress={() => hapusSubItem(item.id)}>
                <Text style={styles.hapusText}>Hapus</Text>
              </Pressable>
            </View>
          ))
        )}
      </View>

      {/* MODAL FORM INSIDE A FORM */}
      <Modal visible={isModalOpen} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Tambah Detail Barang Baru</Text>

            <Text style={styles.label}>Nama Barang Detail</Text>
            <TextInput
              style={styles.input}
              value={namaSubItem}
              onChangeText={setNamaSubItem}
              placeholder="Contoh: Dompet / Kunci"
            />

            <Text style={styles.label}>Jumlah</Text>
            <TextInput
              style={styles.input}
              value={jumlahSubItem}
              onChangeText={setJumlahSubItem}
              keyboardType="numeric"
            />

            {/* Tombol Simpan & Batal Sub-Form */}
            <View style={styles.modalButtonRow}>
              <Pressable
                style={[styles.btnModal, styles.btnBatal]}
                onPress={() => setIsModalOpen(false)}
              >
                <Text style={styles.btnBatalText}>Batal</Text>
              </Pressable>

              <Pressable
                style={[styles.btnModal, styles.btnSimpan]}
                onPress={tambahSubItem}
              >
                <Text style={styles.btnSimpanText}>Tambah ke Form</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Tombol Simpan Form Utama */}
      <Pressable
        style={styles.btnSubmitUtama}
        onPress={() => {
          Alert.alert("Sukses", "Laporan utama & seluruh sub-item tersimpan!");
        }}
      >
        <Text style={styles.btnSubmitText}>Kirim Seluruh Laporan</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#F9FAFB" },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 16 },
  label: { fontWeight: "600", marginBottom: 6 },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    marginBottom: 12,
  },
  subFormContainer: {
    backgroundColor: "#EFF6FF",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#BFDBFE",
    marginBottom: 20,
  },
  subFormHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  subFormTitle: { fontWeight: "700", color: "#1E3A8A" },
  btnTambahSub: {
    backgroundColor: "#1E3A8A",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  btnTambahSubText: { color: "#fff", fontWeight: "600", fontSize: 12 },
  emptyText: { color: "#6B7280", fontStyle: "italic", fontSize: 12 },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 6,
    marginBottom: 6,
  },
  itemText: { fontWeight: "500" },
  hapusText: { color: "#DC2626", fontWeight: "600", fontSize: 12 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
  },
  modalButtonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  btnModal: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8 },
  btnBatal: { marginRight: 8 },
  btnBatalText: { color: "#6B7280", fontWeight: "600" },
  btnSimpan: { backgroundColor: "#16A34A" },
  btnSimpanText: { color: "#fff", fontWeight: "700" },
  btnSubmitUtama: {
    backgroundColor: "#E07B39",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 40,
  },
  btnSubmitText: { color: "#fff", fontWeight: "700" },
});
