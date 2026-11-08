import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  fetchCampusWeather,
  type CampusWeather,
} from "../lib/weather";

const WEATHER_DESCRIPTIONS: Record<number, string> = {
  0: "Cerah",
  1: "Cerah berawan",
  2: "Berawan sebagian",
  3: "Mendung",
  45: "Berkabut",
  48: "Berkabut",
  51: "Gerimis ringan",
  53: "Gerimis",
  55: "Gerimis lebat",
  61: "Hujan ringan",
  63: "Hujan",
  65: "Hujan lebat",
  71: "Salju ringan",
  73: "Salju",
  75: "Salju lebat",
  80: "Hujan lokal",
  81: "Hujan lokal",
  82: "Hujan lokal lebat",
  95: "Badai petir",
  96: "Badai petir",
  99: "Badai petir",
};

export default function CampusWeatherCard() {
  const [weather, setWeather] = useState<CampusWeather | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const loadWeather = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await fetchCampusWeather();
        if (isMounted) setWeather(result);
      } catch (error) {
        if (isMounted) {
          setError(
            error instanceof Error
              ? error.message
              : "Tidak dapat memuat cuaca kampus.",
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    void loadWeather();
    return () => {
      isMounted = false;
    };
  }, [retryCount]);

  const retry = () => setRetryCount((count) => count + 1);
  const updatedAt = weather?.time.split("T")[1]?.slice(0, 5);

  return (
    <View style={styles.card}>
      <View style={styles.headingRow}>
        <View>
          <Text style={styles.eyebrow}>INFO KAMPUS</Text>
          <Text style={styles.title}>Cuaca sekitar UMM</Text>
        </View>
        {loading && <ActivityIndicator color="#1E3A8A" />}
      </View>

      {loading && !weather ? (
        <Text style={styles.message}>Mengambil data cuaca...</Text>
      ) : error && !weather ? (
        <View>
          <Text style={styles.error}>{error}</Text>
          <Pressable
            accessibilityRole="button"
            onPress={retry}
            style={styles.retryButton}
          >
            <Text style={styles.retryText}>Coba lagi</Text>
          </Pressable>
        </View>
      ) : weather ? (
        <View>
          <View style={styles.weatherRow}>
            <Text style={styles.temperature}>
              {Math.round(weather.temperature)}°
            </Text>
            <View style={styles.details}>
              <Text style={styles.condition}>
                {WEATHER_DESCRIPTIONS[weather.weatherCode] ?? "Cuaca terkini"}
              </Text>
              <Text style={styles.message}>
                Hujan {weather.precipitation} mm
                {updatedAt ? ` · Diperbarui ${updatedAt}` : ""}
              </Text>
            </View>
          </View>
          {error ? (
            <View style={styles.errorRow}>
              <Text style={[styles.error, styles.staleError]}>{error}</Text>
              <Pressable
                accessibilityRole="button"
                onPress={retry}
                style={styles.retryButton}
              >
                <Text style={styles.retryText}>Muat ulang</Text>
              </Pressable>
            </View>
          ) : null}
        </View>
      ) : null}

      <Text style={styles.source}>Data: Open-Meteo</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#EFF6FF",
    borderColor: "#BFDBFE",
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 12,
    padding: 14,
  },
  headingRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  eyebrow: {
    color: "#1E3A8A",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.8,
  },
  title: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "700",
    marginTop: 2,
  },
  weatherRow: {
    alignItems: "center",
    flexDirection: "row",
    marginTop: 8,
  },
  temperature: {
    color: "#1E3A8A",
    fontSize: 34,
    fontWeight: "700",
    marginRight: 12,
  },
  details: {
    flex: 1,
  },
  condition: {
    color: "#111827",
    fontSize: 14,
    fontWeight: "600",
  },
  message: {
    color: "#4B5563",
    fontSize: 12,
    marginTop: 4,
  },
  error: {
    color: "#B91C1C",
    fontSize: 12,
    marginTop: 10,
  },
  errorRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  staleError: {
    flex: 1,
    marginRight: 8,
  },
  retryButton: {
    alignSelf: "flex-start",
    backgroundColor: "#1E3A8A",
    borderRadius: 8,
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  retryText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  source: {
    color: "#6B7280",
    fontSize: 10,
    marginTop: 8,
  },
});
