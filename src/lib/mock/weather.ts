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

export const currentWeather: CurrentWeather = {
  location: "San Francisco",
  region: "California, USA",
  tempF: 63,
  feelsLikeF: 61,
  condition: "partly-cloudy",
  conditionLabel: "Partly Cloudy",
  high: 68,
  low: 54,
  humidity: 74,
  windMph: 12,
  windDir: "WSW",
  uv: 4,
  sunrise: "6:42 AM",
  sunset: "7:58 PM",
};

export type HourlyPoint = { time: string; tempF: number; condition: Condition; precip: number };

const now = new Date();
export const hourly: HourlyPoint[] = Array.from({ length: 24 }, (_, i) => {
  const d = new Date(now.getTime() + i * 3600 * 1000);
  const t = 58 + Math.round(6 * Math.sin(i / 3) + (i > 6 && i < 18 ? 6 : 0));
  const cond: Condition =
    i >= 5 && i <= 9 ? "rain" : i >= 14 && i <= 18 ? "partly-cloudy" : i >= 20 ? "cloudy" : "partly-cloudy";
  return {
    time: d.toISOString(),
    tempF: t,
    condition: cond,
    precip: cond === "rain" ? 60 + i : cond === "cloudy" ? 20 : 5,
  };
});

export type DayForecast = {
  date: string;
  condition: Condition;
  high: number;
  low: number;
  precip: number;
};

export const sevenDay: DayForecast[] = [
  { date: addDays(0), condition: "partly-cloudy", high: 68, low: 54, precip: 20 },
  { date: addDays(1), condition: "rain", high: 62, low: 52, precip: 85 },
  { date: addDays(2), condition: "storm", high: 60, low: 51, precip: 95 },
  { date: addDays(3), condition: "cloudy", high: 64, low: 53, precip: 35 },
  { date: addDays(4), condition: "sunny", high: 71, low: 55, precip: 5 },
  { date: addDays(5), condition: "sunny", high: 74, low: 57, precip: 5 },
  { date: addDays(6), condition: "partly-cloudy", high: 70, low: 56, precip: 15 },
];

function addDays(n: number) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString();
}
