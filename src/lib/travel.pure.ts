// Pure, testable helpers extracted from travel.functions.ts.
// Kept in a separate module so tests (and any client code) can import them
// without pulling in the server-fn transform.

export const WMO: Record<number, string> = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Freezing fog",
  51: "Light drizzle",
  53: "Drizzle",
  55: "Heavy drizzle",
  61: "Light rain",
  63: "Rain",
  65: "Heavy rain",
  66: "Freezing rain",
  67: "Heavy freezing rain",
  71: "Light snow",
  73: "Snow",
  75: "Heavy snow",
  77: "Snow grains",
  80: "Rain showers",
  81: "Heavy showers",
  82: "Violent showers",
  85: "Snow showers",
  86: "Heavy snow showers",
  95: "Thunderstorm",
  96: "Thunderstorm w/ hail",
  99: "Severe thunderstorm",
};

export function condition(code: number): string {
  return WMO[code] ?? "Unknown";
}

export function haversineKm(
  a: { lat: number; lon: number },
  b: { lat: number; lon: number },
): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLon = ((b.lon - a.lon) * Math.PI) / 180;
  const s1 = Math.sin(dLat / 2);
  const s2 = Math.sin(dLon / 2);
  const aa =
    s1 * s1 + Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * s2 * s2;
  return Math.round(2 * R * Math.asin(Math.sqrt(aa)));
}

export type AdvisoryLevel = "safe" | "caution" | "warning" | "danger";

export type DestinationConditions = {
  tempC: number;
  tempMaxC: number;
  tempMinC: number;
  precipMm: number;
  windKph: number;
  windGustKph: number;
  weatherCode: number;
};

export type Assessment = {
  level: AdvisoryLevel;
  headline: string;
  reasons: string[];
  tips: string[];
};

export function assessAdvisory(d: DestinationConditions): Assessment {
  const reasons: string[] = [];
  const tips: string[] = [];
  let score = 0;

  const c = d.weatherCode;
  if ([95, 96, 99].includes(c)) {
    score += 4;
    reasons.push("Thunderstorms forecast at destination");
    tips.push("Avoid open roads and elevated terrain; delay travel if possible.");
  }
  if ([65, 67, 82, 75, 86].includes(c)) {
    score += 3;
    reasons.push("Heavy precipitation expected");
    tips.push("Expect road flooding and low visibility; carry rain gear.");
  }
  if ([63, 81, 73, 85].includes(c)) {
    score += 2;
    reasons.push("Steady rain or snow at destination");
  }
  if ([45, 48].includes(c)) {
    score += 2;
    reasons.push("Fog reducing visibility");
    tips.push("Allow extra travel time; keep low-beam headlights on.");
  }
  if ([66, 67].includes(c)) {
    score += 3;
    reasons.push("Freezing rain — icy surfaces likely");
    tips.push("Winterize footwear; expect flight and rail delays.");
  }

  if (d.windGustKph >= 70) {
    score += 3;
    reasons.push(`Damaging wind gusts up to ${d.windGustKph} km/h`);
    tips.push("High-profile vehicles at risk; expect flight disruptions.");
  } else if (d.windKph >= 40) {
    score += 1;
    reasons.push(`Strong sustained winds (${d.windKph} km/h)`);
  }

  if (d.precipMm >= 25) {
    score += 2;
    reasons.push(`${d.precipMm.toFixed(0)} mm rainfall in 24h`);
  } else if (d.precipMm >= 10) {
    score += 1;
  }

  if (d.tempMaxC >= 40) {
    score += 3;
    reasons.push(`Extreme heat (${d.tempMaxC}°C)`);
    tips.push("Stay hydrated; travel early morning or after sunset.");
  } else if (d.tempMaxC >= 35) {
    score += 1;
    reasons.push(`Hot day (${d.tempMaxC}°C)`);
    tips.push("Carry water; avoid midday exertion.");
  }

  if (d.tempMinC <= -10) {
    score += 3;
    reasons.push(`Extreme cold (${d.tempMinC}°C)`);
    tips.push("Layer up; watch for frostbite and black ice.");
  } else if (d.tempMinC <= 0) {
    score += 1;
    reasons.push(`Sub-zero temperatures (${d.tempMinC}°C)`);
  }

  let level: AdvisoryLevel;
  let headline: string;
  if (score >= 6) {
    level = "danger";
    headline = "Not advisable — postpone travel if you can.";
  } else if (score >= 3) {
    level = "warning";
    headline = "Travel with caution — significant weather impact expected.";
  } else if (score >= 1) {
    level = "caution";
    headline = "Minor weather to plan around.";
  } else {
    level = "safe";
    headline = "Clear to travel — no significant weather concerns.";
  }

  if (tips.length === 0) {
    tips.push("Conditions look favorable. Check for local advisories before departure.");
  }
  return { level, headline, reasons, tips };
}
