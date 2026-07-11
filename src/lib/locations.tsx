import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type SavedLocation = {
  id: string;
  name: string;   // e.g. "Bengaluru"
  region: string; // e.g. "Karnataka, India"
  country: string;
  lat: number;
  lon: number;
  label?: string; // "Home", "Work", "Family"
  notifications?: boolean;
};

const DEFAULT_LOCATIONS: SavedLocation[] = [
  { id: "bengaluru", name: "Bengaluru", region: "Karnataka, India", country: "India", lat: 12.9716, lon: 77.5946, label: "Home", notifications: true },
  { id: "mumbai", name: "Mumbai", region: "Maharashtra, India", country: "India", lat: 19.076, lon: 72.8777, notifications: true },
  { id: "chennai", name: "Chennai", region: "Tamil Nadu, India", country: "India", lat: 13.0827, lon: 80.2707, label: "Work", notifications: false },
];

type Ctx = {
  locations: SavedLocation[];
  activeId: string;
  active: SavedLocation;
  homeId: string;
  setActive: (id: string) => void;
  addLocation: (loc: Omit<SavedLocation, "id">) => string;
  removeLocation: (id: string) => void;
  renameLocation: (id: string, label: string) => void;
  setHome: (id: string) => void;
  toggleNotifications: (id: string) => void;
  detectCurrent: () => Promise<void>;
  detecting: boolean;
  detectError: string | null;
  refreshTick: number;
  refresh: () => void;
};

const LocationContext = createContext<Ctx | null>(null);

const LS_KEY = "aurora.locations.v1";
const LS_ACTIVE = "aurora.locations.active.v1";
const LS_HOME = "aurora.locations.home.v1";

type Persisted = { locations: SavedLocation[]; activeId?: string; homeId?: string };

function loadPersisted(): Persisted | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    const locations = JSON.parse(raw) as SavedLocation[];
    return {
      locations,
      activeId: localStorage.getItem(LS_ACTIVE) || undefined,
      homeId: localStorage.getItem(LS_HOME) || undefined,
    };
  } catch {
    return null;
  }
}

export function LocationProvider({ children }: { children: ReactNode }) {
  const [locations, setLocations] = useState<SavedLocation[]>(DEFAULT_LOCATIONS);
  const [activeId, setActiveId] = useState<string>(DEFAULT_LOCATIONS[0].id);
  const [homeId, setHomeId] = useState<string>(DEFAULT_LOCATIONS[0].id);
  const [detecting, setDetecting] = useState(false);
  const [detectError, setDetectError] = useState<string | null>(null);
  const [refreshTick, setRefreshTick] = useState(0);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const p = loadPersisted();
    if (p && p.locations.length) {
      setLocations(p.locations);
      const home = p.homeId && p.locations.some((l) => l.id === p.homeId) ? p.homeId : p.locations[0].id;
      const active = p.activeId && p.locations.some((l) => l.id === p.activeId) ? p.activeId : home;
      setHomeId(home);
      setActiveId(active);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(LS_KEY, JSON.stringify(locations));
  }, [locations, hydrated]);
  useEffect(() => {
    if (hydrated) localStorage.setItem(LS_ACTIVE, activeId);
  }, [activeId, hydrated]);
  useEffect(() => {
    if (hydrated) localStorage.setItem(LS_HOME, homeId);
  }, [homeId, hydrated]);

  const active = useMemo(
    () => locations.find((l) => l.id === activeId) ?? locations[0] ?? DEFAULT_LOCATIONS[0],
    [locations, activeId],
  );

  const addLocation = useCallback((loc: Omit<SavedLocation, "id">) => {
    const id = `${loc.name}-${loc.lat.toFixed(3)}-${loc.lon.toFixed(3)}`.toLowerCase().replace(/[^a-z0-9-]/g, "-");
    setLocations((prev) => {
      if (prev.some((p) => p.id === id)) return prev;
      return [...prev, { ...loc, id }];
    });
    setActiveId(id);
    return id;
  }, []);

  const removeLocation = useCallback(
    (id: string) => {
      setLocations((prev) => {
        const next = prev.filter((l) => l.id !== id);
        if (next.length === 0) return prev; // keep at least one
        if (activeId === id) setActiveId(next[0].id);
        if (homeId === id) setHomeId(next[0].id);
        return next;
      });
    },
    [activeId, homeId],
  );

  const renameLocation = useCallback((id: string, label: string) => {
    setLocations((prev) => prev.map((l) => (l.id === id ? { ...l, label: label.trim() || undefined } : l)));
  }, []);

  const setHome = useCallback((id: string) => setHomeId(id), []);

  const toggleNotifications = useCallback((id: string) => {
    setLocations((prev) => prev.map((l) => (l.id === id ? { ...l, notifications: !l.notifications } : l)));
  }, []);

  const detectCurrent = useCallback(async () => {
    setDetectError(null);
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setDetectError("Geolocation isn't supported in this browser.");
      return;
    }
    setDetecting(true);
    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000, maximumAge: 60000 }),
      );
      const { latitude, longitude } = pos.coords;
      let name = "My Location";
      let region = `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;
      let country = "";
      try {
        const res = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
        );
        if (res.ok) {
          const j = (await res.json()) as {
            city?: string;
            locality?: string;
            principalSubdivision?: string;
            countryName?: string;
          };
          name = j.city || j.locality || name;
          country = j.countryName || "";
          region = [j.principalSubdivision, j.countryName].filter(Boolean).join(", ") || region;
        }
      } catch {
        // ignore reverse-geocode failure; still add coords-based location
      }
      const id = addLocation({ name, region, country, lat: latitude, lon: longitude, label: "Current" });
      setActiveId(id);
    } catch (err) {
      const e = err as GeolocationPositionError | Error;
      const code = (e as GeolocationPositionError).code;
      if (code === 1) setDetectError("Location permission denied. Search for a city instead.");
      else if (code === 3) setDetectError("Location request timed out. Try again.");
      else setDetectError((e as Error).message || "Couldn't detect your location.");
    } finally {
      setDetecting(false);
    }
  }, [addLocation]);

  const refresh = useCallback(() => setRefreshTick((t) => t + 1), []);

  const value: Ctx = {
    locations,
    activeId,
    active,
    homeId,
    setActive: setActiveId,
    addLocation,
    removeLocation,
    renameLocation,
    setHome,
    toggleNotifications,
    detectCurrent,
    detecting,
    detectError,
    refreshTick,
    refresh,
  };

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
}

export function useLocation() {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error("useLocation must be used inside <LocationProvider>");
  return ctx;
}

// Open-Meteo geocoding autocomplete (free, no key, CORS-friendly).
export type GeoSuggestion = {
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
};

export async function searchCities(query: string, signal?: AbortSignal): Promise<GeoSuggestion[]> {
  const q = query.trim();
  if (q.length < 2) return [];
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=8&language=en&format=json`;
  const res = await fetch(url, { signal });
  if (!res.ok) return [];
  const j = (await res.json()) as {
    results?: Array<{
      name: string;
      admin1?: string;
      admin2?: string;
      country?: string;
      latitude: number;
      longitude: number;
    }>;
  };
  return (j.results ?? []).map((r) => ({
    name: r.name,
    region: [r.admin1, r.country].filter(Boolean).join(", "),
    country: r.country ?? "",
    lat: r.latitude,
    lon: r.longitude,
  }));
}
