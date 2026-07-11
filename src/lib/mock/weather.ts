export type Condition = "sunny" | "partly-cloudy" | "cloudy" | "rain" | "storm" | "snow" | "fog";

export type CurrentWeather = {
  location: string;
  region: string;
  tempF: number;
  feelsLikeF: number;
  condition: Condition;
  conditionLabel: string;
  high: number;
  low: number;
  humidity: number;
  windMph: number;
  windDir: string;
  uv: number;
  sunrise: string;
  sunset: string;
};

export type HourlyPoint = { time: string; tempF: number; condition: Condition; precip: number };
export type DayForecast = {
  date: string;
  condition: Condition;
  high: number;
  low: number;
  precip: number;
};

type Seed = { name: string; region: string; lat: number; lon: number };

const CONDITIONS: Condition[] = ["sunny", "partly-cloudy", "cloudy", "rain", "storm", "fog"];
const LABELS: Record<Condition, string> = {
  sunny: "Sunny",
  "partly-cloudy": "Partly Cloudy",
  cloudy: "Cloudy",
  rain: "Rain Showers",
  storm: "Thunderstorms",
  snow: "Snow",
  fog: "Foggy",
};
const DIRS = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

function addDays(n: number) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString();
}

function baseTemp(lat: number) {
  const absLat = Math.abs(lat);
  // Celsius: warm near equator (~31°C), cooler toward poles.
  return Math.round(31 - absLat * 0.47);
}

function pickCondition(h: number, i: number): Condition {
  return CONDITIONS[(h + i) % CONDITIONS.length];
}

export function weatherFor(loc: Seed): CurrentWeather {
  const h = hash(loc.name + loc.lat.toFixed(2));
  const tempC = baseTemp(loc.lat) + ((h % 7) - 3);
  const condition = pickCondition(h, 0);
  return {
    location: loc.name,
    region: loc.region,
    tempF: tempC,
    feelsLikeF: tempC - ((h % 3) - 1),
    condition,
    conditionLabel: LABELS[condition],
    high: tempC + 2 + (h % 3),
    low: tempC - 4 - (h % 3),
    humidity: 45 + (h % 45),
    windMph: 4 + (h % 18),
    windDir: DIRS[h % DIRS.length],
    uv: 1 + (h % 10),
    sunrise: `${5 + ((h >> 3) % 3)}:${String((h >> 5) % 60).padStart(2, "0")} AM`,
    sunset: `${6 + ((h >> 7) % 3)}:${String((h >> 9) % 60).padStart(2, "0")} PM`,
  };
}

export function hourlyFor(loc: Seed): HourlyPoint[] {
  const h = hash(loc.name + "hourly");
  const base = baseTemp(loc.lat);
  const now = new Date();
  return Array.from({ length: 24 }, (_, i) => {
    const d = new Date(now.getTime() + i * 3600 * 1000);
    const t = base - 3 + Math.round(4 * Math.sin((i + (h % 6)) / 3) + (i > 6 && i < 18 ? 3 : 0));
    const cond = pickCondition(h, i);
    return {
      time: d.toISOString(),
      tempF: t,
      condition: cond,
      precip:
        cond === "rain" || cond === "storm"
          ? 55 + ((h + i) % 40)
          : cond === "cloudy"
            ? 15 + (i % 10)
            : 5 + (i % 5),
    };
  });
}

export function sevenDayFor(loc: Seed): DayForecast[] {
  const h = hash(loc.name + "week");
  const base = baseTemp(loc.lat);
  return Array.from({ length: 7 }, (_, i) => {
    const cond = pickCondition(h, i * 2 + 1);
    const high = base + 2 + ((h + i) % 4);
    const low = base - 4 - ((h + i * 3) % 4);
    return {
      date: addDays(i),
      condition: cond,
      high,
      low,
      precip:
        cond === "rain" || cond === "storm"
          ? 70 + ((h + i) % 25)
          : cond === "cloudy"
            ? 25 + ((i * 5) % 20)
            : 5 + ((i * 3) % 10),
    };
  });
}

// Back-compat default exports (used by any not-yet-migrated component/mocks).
const DEFAULT_SEED: Seed = {
  name: "Bengaluru",
  region: "Karnataka, India",
  lat: 12.97,
  lon: 77.59,
};
export const currentWeather: CurrentWeather = weatherFor(DEFAULT_SEED);
export const hourly: HourlyPoint[] = hourlyFor(DEFAULT_SEED);
export const sevenDay: DayForecast[] = sevenDayFor(DEFAULT_SEED);
