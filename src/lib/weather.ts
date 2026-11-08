export interface CampusWeather {
  temperature: number;
  precipitation: number;
  weatherCode: number;
  time: string;
}

const CAMPUS_LATITUDE = -7.9215;
const CAMPUS_LONGITUDE = 112.5941;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export async function fetchCampusWeather(): Promise<CampusWeather> {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", CAMPUS_LATITUDE.toString());
  url.searchParams.set("longitude", CAMPUS_LONGITUDE.toString());
  url.searchParams.set(
    "current",
    "temperature_2m,precipitation,weather_code",
  );
  url.searchParams.set("timezone", "Asia/Jakarta");

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Server cuaca merespons dengan status ${response.status}.`);
  }

  const payload: unknown = await response.json();
  if (
    !isRecord(payload) ||
    !isRecord(payload.current) ||
    typeof payload.current.temperature_2m !== "number" ||
    typeof payload.current.precipitation !== "number" ||
    typeof payload.current.weather_code !== "number" ||
    typeof payload.current.time !== "string"
  ) {
    throw new Error("Format data cuaca dari server tidak sesuai.");
  }

  return {
    temperature: payload.current.temperature_2m,
    precipitation: payload.current.precipitation,
    weatherCode: payload.current.weather_code,
    time: payload.current.time,
  };
}
