import { StyleSheet } from "react-native";

export const homeStyles = StyleSheet.create({
  searchArea: {
    padding: 12,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  resetButton: {
    marginLeft: 10,
  },
  summary: {
    color: "#6B7280",
    marginTop: 8,
  },
  filterRow: {
    marginTop: 10,
  },
  listContent: {
    padding: 12,
    paddingBottom: 90,
  },
  emptyMessage: {
    textAlign: "center",
    color: "#6B7280",
    marginTop: 40,
  },
  itemCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  itemName: {
    fontWeight: "700",
    fontSize: 16,
  },
  itemStatus: {
    fontWeight: "700",
  },
  itemMeta: {
    color: "#6B7280",
    marginTop: 4,
  },
  floatingButton: {
    position: "absolute",
    right: 16,
    bottom: 24,
    backgroundColor: "#E07B39",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 30,
  },
  guideButton: {
    position: "absolute",
    left: 16,
    bottom: 24,
    backgroundColor: "#1E3A8A",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 30,
  },
  actionText: {
    color: "#fff",
    fontWeight: "700",
  },
});
