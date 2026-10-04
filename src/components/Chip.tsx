import { Pressable, Text } from "react-native";

export default function Chip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        paddingHorizontal: 14,
        paddingVertical: 7,
        borderRadius: 20,
        marginRight: 8,
        marginBottom: 8,
        backgroundColor: active ? "#1E3A8A" : "#E5E7EB",
      }}
    >
      <Text style={{ color: active ? "#fff" : "#111", fontSize: 13 }}>
        {label}
      </Text>
    </Pressable>
  );
}
