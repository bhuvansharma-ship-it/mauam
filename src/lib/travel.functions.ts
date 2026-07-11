import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const CoordSchema = z.object({
  name: z.string(),
  region: z.string().optional().default(""),
  country: z.string().optional().default(""),
  lat: z.number(),
  lon: z.number(),
});

const InputSchema = z.object({
  from: CoordSchema,
  to: CoordSchema,
});

export type TravelAdvisory = {
  from: { name: string; region: string };
  to: { name: string; region: string };
  distanceKm: number;
  destination: {
    tempC: number;
    tempMaxC: number;
    tempMinC: number;
    precipMm: number;
    windKph: number;
    windGustKph: number;
    weatherCode: number;
    condition: string;
    sunrise: string;
    sunset: string;
  };
  daily: Array<{
    date: string;
    tempMaxC: number;
    tempMinC: number;
    precipMm: number;
    windKph: number;
    weatherCode: number;
    condition: string;
  }>;
  level: "safe" | "caution" | "warning" | "danger";
  headline: string;
  reasons: string[];
  tips: string[];
};

const WMO: Record<number, string> = {
  0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
  45: "Fog", 48: "Freezing fog",
  51: "Light drizzle", 53: "Drizzle", 55: "Heavy drizzle",
  61: "Light rain", 63: "Rain", 65: "Heavy rain",
  66: "Freezing rain", 67: "Heavy freezing rain",
  71: "Light snow", 73: "Snow", 75: "Heavy snow", 77: "Snow grains",
  80: "Rain showers", 81: "Heavy showers", 82: "Violent showers",
  85: "Snow showers", 86: "Heavy snow showers",
  95: "Thunderstorm", 96: "Thunderstorm w/ hail", 99: "Severe thunderstorm",
};

function condition(code: number) {
  return WMO[code] ?? "Unknown";
}

function haversineKm(a: { lat: number; lon: number }, b: { lat: number; lon: number }) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLon = ((b.lon - a.lon) * Math.PI) / 180;
  const s1 = Math.sin(dLat / 2);
  const s2 = Math.sin(dLon / 2);
  const aa = s1 * s1 + Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * s2 * s2;
  return Math.round(2 * R * Math.asin(Math.sqrt(aa)));
}

function assessAdvisory(d: TravelAdvisory["destination"]): Pick<TravelAdvisory, "level" | "headline" | "reasons" | "tips"> {
  const reasons: string[] = [];
  const tips: string[] = [];
  let score = 0;

  const c = d.weatherCode;
  if ([95, 96, 99].includes(c)) { score += 4; reasons.push("Thunderstorms forecast at destination"); tips.push("Avoid open roads and elevated terrain; delay travel if possible."); }
  if ([65, 67, 82, 75, 86].includes(c)) { score += 3; reasons.push("Heavy precipitation expected"); tips.push("Expect road flooding and low visibility; carry rain gear."); }
  if ([63, 81, 73, 85].includes(c)) { score += 2; reasons.push("Steady rain or snow at destination"); }
  if ([45, 48].includes(c)) { score += 2; reasons.push("Fog reducing visibility"); tips.push("Allow extra travel time; keep low-beam headlights on."); }
  if ([66, 67].includes(c)) { score += 3; reasons.push("Freezing rain — icy surfaces likely"); tips.push("Winterize footwear; expect flight and rail delays."); }

  if (d.windGustKph >= 70) { score += 3; reasons.push(`Damaging wind gusts up to ${d.windGustKph} km/h`); tips.push("High-profile vehicles at risk; expect flight disruptions."); }
  else if (d.windKph >= 40) { score += 1; reasons.push(`Strong sustained winds (${d.windKph} km/h)`); }

  if (d.precipMm >= 25) { score += 2; reasons.push(`${d.precipMm.toFixed(0)} mm rainfall in 24h`); }
  else if (d.precipMm >= 10) { score += 1; }

  if (d.tempMaxC >= 40) { score += 3; reasons.push(`Extreme heat (${d.tempMaxC}°C)`); tips.push("Stay hydrated; travel early morning or after sunset."); }
  else if (d.tempMaxC >= 35) { score += 1; reasons.push(`Hot day (${d.tempMaxC}°C)`); tips.push("Carry water; avoid midday exertion."); }

  if (d.tempMinC <= -10) { score += 3; reasons.push(`Extreme cold (${d.tempMinC}°C)`); tips.push("Layer up; watch for frostbite and black ice."); }
  else if (d.tempMinC <= 0) { score += 1; reasons.push(`Sub-zero temperatures (${d.tempMinC}°C)`); }

  let level: TravelAdvisory["level"];
  let headline: string;
  if (score >= 6) { level = "danger"; headline = "Not advisable — postpone travel if you can."; }
  else if (score >= 3) { level = "warning"; headline = "Travel with caution — significant weather impact expected."; }
  else if (score >= 1) { level = "caution"; headline = "Minor weather to plan around."; }
  else { level = "safe"; headline = "Clear to travel — no significant weather concerns."; }

  if (tips.length === 0) tips.push("Conditions look favorable. Check for local advisories before departure.");
  return { level, headline, reasons, tips };
}

export const fetchTravelAdvisory = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => InputSchema.parse(data))
  .handler(async ({ data }): Promise<TravelAdvisory> => {
    const { from, to } = data;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${to.lat}&longitude=${to.lon}&current=temperature_2m,weather_code,wind_speed_10m,wind_gusts_10m,precipitation&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max,weather_code,sunrise,sunset&timezone=auto&forecast_days=5&wind_speed_unit=kmh`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Weather service unavailable");
    const j = (await res.json()) as {
      current: { temperature_2m: number; weather_code: number; wind_speed_10m: number; wind_gusts_10m: number; precipitation: number };
      daily: {
        time: string[];
        temperature_2m_max: number[];
        temperature_2m_min: number[];
        precipitation_sum: number[];
        wind_speed_10m_max: number[];
        weather_code: number[];
        sunrise: string[];
        sunset: string[];
      };
    };

    const dayIdx = 0;
    const destination: TravelAdvisory["destination"] = {
      tempC: Math.round(j.current.temperature_2m),
      tempMaxC: Math.round(j.daily.temperature_2m_max[dayIdx]),
      tempMinC: Math.round(j.daily.temperature_2m_min[dayIdx]),
      precipMm: j.daily.precipitation_sum[dayIdx] ?? j.current.precipitation ?? 0,
      windKph: Math.round(j.current.wind_speed_10m),
      windGustKph: Math.round(j.current.wind_gusts_10m ?? j.current.wind_speed_10m),
      weatherCode: j.current.weather_code,
      condition: condition(j.current.weather_code),
      sunrise: j.daily.sunrise[dayIdx],
      sunset: j.daily.sunset[dayIdx],
    };

    const daily = j.daily.time.map((date, i) => ({
      date,
      tempMaxC: Math.round(j.daily.temperature_2m_max[i]),
      tempMinC: Math.round(j.daily.temperature_2m_min[i]),
      precipMm: j.daily.precipitation_sum[i] ?? 0,
      windKph: Math.round(j.daily.wind_speed_10m_max[i] ?? 0),
      weatherCode: j.daily.weather_code[i],
      condition: condition(j.daily.weather_code[i]),
    }));

    const assessment = assessAdvisory(destination);

    return {
      from: { name: from.name, region: from.region },
      to: { name: to.name, region: to.region },
      distanceKm: haversineKm(from, to),
      destination,
      daily,
      ...assessment,
    };
  });
