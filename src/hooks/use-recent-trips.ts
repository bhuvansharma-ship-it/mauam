import { useCallback, useEffect, useState } from "react";
import type { TravelAdvisory } from "../lib/travel.functions";

export type RecentTrip = {
  id: string;
  savedAt: string;
  from: TravelAdvisory["from"];
  to: TravelAdvisory["to"];
  distanceKm: number;
  level: TravelAdvisory["level"];
  headline: string;
  condition: string;
  tempC: number;
  windKph: number;
};

const STORAGE_KEY = "mausam.recent-trips.v1";
const MAX = 5;
const EVENT = "mausam:recent-trips";

function read(): RecentTrip[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as RecentTrip[]) : [];
  } catch {
    return [];
  }
}

function write(trips: RecentTrip[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
  window.dispatchEvent(new CustomEvent(EVENT));
}

function tripKey(a: TravelAdvisory) {
  return `${a.from.name}|${a.from.region}=>${a.to.name}|${a.to.region}`;
}

export function useRecentTrips() {
  const [trips, setTrips] = useState<RecentTrip[]>([]);

  useEffect(() => {
    setTrips(read());
    const sync = () => setTrips(read());
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const add = useCallback((advisory: TravelAdvisory) => {
    const key = tripKey(advisory);
    const entry: RecentTrip = {
      id: key,
      savedAt: new Date().toISOString(),
      from: advisory.from,
      to: advisory.to,
      distanceKm: advisory.distanceKm,
      level: advisory.level,
      headline: advisory.headline,
      condition: advisory.destination.condition,
      tempC: advisory.destination.tempC,
      windKph: advisory.destination.windKph,
    };
    const next = [entry, ...read().filter((t) => t.id !== key)].slice(0, MAX);
    write(next);
  }, []);

  const clear = useCallback(() => write([]), []);

  return { trips, add, clear };
}
