import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { assessAdvisory, condition, haversineKm } from "./travel.pure";

const CoordSchema = z.object({
  name: z.string().trim().min(1).max(120),
  region: z.string().trim().max(120).optional().default(""),
  country: z.string().trim().max(120).optional().default(""),
  lat: z.number().min(-90).max(90),
  lon: z.number().min(-180).max(180),
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

export const fetchTravelAdvisory = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => InputSchema.parse(data))
  .handler(async ({ data }): Promise<TravelAdvisory> => {
    const { from, to } = data;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${to.lat}&longitude=${to.lon}&current=temperature_2m,weather_code,wind_speed_10m,wind_gusts_10m,precipitation&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max,weather_code,sunrise,sunset&timezone=auto&forecast_days=5&wind_speed_unit=kmh`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Weather service unavailable");
    const j = (await res.json()) as {
      current: {
        temperature_2m: number;
        weather_code: number;
        wind_speed_10m: number;
        wind_gusts_10m: number;
        precipitation: number;
      };
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
