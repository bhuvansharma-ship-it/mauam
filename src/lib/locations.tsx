import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type SavedLocation = {
  id: string;
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  label?: string;
  notifications?: boolean;
  is_home?: boolean;
};

type Ctx = {
  locations: SavedLocation[];
  activeId: string;
  active: SavedLocation;
  homeId: string;
  setActive: (id: string) => void;
  addLocation: (loc: Omit<SavedLocation, "id">) => Promise<string>;
  removeLocation: (id: string) => Promise<void>;
  renameLocation: (id: string, label: string) => Promise<void>;
  setHome: (id: string) => Promise<void>;
  toggleNotifications: (id: string) => Promise<void>;
  detectCurrent: () => Promise<void>;
  detecting: boolean;
  detectError: string | null;
  refreshTick: number;
  refresh: () => void;
  loading: boolean;
};

const FALLBACK: SavedLocation = {
  id: "fallback",
  name: "Bengaluru",
  region: "Karnataka, India",
  country: "India",
  lat: 12.9716,
  lon: 77.5946,
  label: "Home",
  notifications: true,
  is_home: true,
};

const LocationContext = createContext<Ctx | null>(null);

type Row = {
  id: string;
  name: string;
  region: string;
  country: string;
  latitude: number;
  longitude: number;
  label: string | null;
  is_home: boolean;
  notifications: boolean;
  sort_order: number;
};

function rowToLocation(r: Row): SavedLocation {
  return {
    id: r.id,
    name: r.name,
    region: r.region,
    country: r.country,
    lat: r.latitude,
    lon: r.longitude,
    label: r.label ?? undefined,
    is_home: r.is_home,
    notifications: r.notifications,
  };
}

async function fetchLocations() {
  const { data, error } = await supabase
    .from("saved_locations")
    .select("id,name,region,country,latitude,longitude,label,is_home,notifications,sort_order")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data as Row[]).map(rowToLocation);
}

async function fetchActive() {
  const { data, error } = await supabase
    .from("user_preferences")
    .select("active_location_id")
    .maybeSingle();
  if (error) throw error;
  return (data?.active_location_id as string | null) ?? null;
}

export function LocationProvider({ children }: { children: ReactNode }) {
  const qc = useQueryClient();
  const [detecting, setDetecting] = useState(false);
  const [detectError, setDetectError] = useState<string | null>(null);
  const [refreshTick, setRefreshTick] = useState(0);

  const locationsQ = useQuery({
    queryKey: ["saved_locations"],
    queryFn: fetchLocations,
    staleTime: 60_000,
  });
  const activeQ = useQuery({
    queryKey: ["user_preferences", "active"],
    queryFn: fetchActive,
    staleTime: 60_000,
  });

  const locations: SavedLocation[] = useMemo(
    () => (locationsQ.data && locationsQ.data.length > 0 ? locationsQ.data : [FALLBACK]),
    [locationsQ.data],
  );
  const homeId = locations.find((l) => l.is_home)?.id ?? locations[0].id;
  const activeId =
    activeQ.data && locations.some((l) => l.id === activeQ.data)
      ? (activeQ.data as string)
      : homeId;
  const active = useMemo(
    () => locations.find((l) => l.id === activeId) ?? locations[0],
    [locations, activeId],
  );

  const setActiveMut = useMutation({
    mutationFn: async (id: string) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { error } = await supabase
        .from("user_preferences")
        .upsert({ user_id: user.id, active_location_id: id, updated_at: new Date().toISOString() });
      if (error) throw error;
    },
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ["user_preferences", "active"] });
      const prev = qc.getQueryData<string | null>(["user_preferences", "active"]);
      qc.setQueryData(["user_preferences", "active"], id);
      return { prev };
    },
    onError: (_e, _id, ctx) => {
      if (ctx) qc.setQueryData(["user_preferences", "active"], ctx.prev);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["user_preferences", "active"] }),
  });

  const addMut = useMutation({
    mutationFn: async (loc: Omit<SavedLocation, "id">) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not signed in");
      const { data, error } = await supabase
        .from("saved_locations")
        .insert({
          user_id: user.id,
          name: loc.name,
          region: loc.region ?? "",
          country: loc.country ?? "",
          latitude: loc.lat,
          longitude: loc.lon,
          label: loc.label ?? null,
          notifications: loc.notifications ?? true,
          is_home: false,
        })
        .select("id")
        .single();
      if (error) throw error;
      return data.id as string;
    },
    onSuccess: async (id) => {
      await qc.invalidateQueries({ queryKey: ["saved_locations"] });
      setActiveMut.mutate(id);
    },
  });

  const removeMut = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("saved_locations").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["saved_locations"] }),
  });

  const renameMut = useMutation({
    mutationFn: async ({ id, label }: { id: string; label: string }) => {
      const { error } = await supabase
        .from("saved_locations")
        .update({ label: label.trim() || null })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["saved_locations"] }),
  });

  const setHomeMut = useMutation({
    mutationFn: async (id: string) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      // clear existing home flags then set new
      await supabase
        .from("saved_locations")
        .update({ is_home: false })
        .eq("user_id", user.id)
        .eq("is_home", true);
      const { error } = await supabase
        .from("saved_locations")
        .update({ is_home: true })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["saved_locations"] }),
  });

  const toggleNotifMut = useMutation({
    mutationFn: async (id: string) => {
      const current = locations.find((l) => l.id === id);
      const next = !(current?.notifications ?? true);
      const { error } = await supabase
        .from("saved_locations")
        .update({ notifications: next })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["saved_locations"] }),
  });

  const addLocation = useCallback(
    async (loc: Omit<SavedLocation, "id">) => addMut.mutateAsync(loc),
    [addMut],
  );
  const removeLocation = useCallback(
    async (id: string) => {
      await removeMut.mutateAsync(id);
    },
    [removeMut],
  );
  const renameLocation = useCallback(
    async (id: string, label: string) => {
      await renameMut.mutateAsync({ id, label });
    },
    [renameMut],
  );
  const setHome = useCallback(
    async (id: string) => {
      await setHomeMut.mutateAsync(id);
    },
    [setHomeMut],
  );
  const toggleNotifications = useCallback(
    async (id: string) => {
      await toggleNotifMut.mutateAsync(id);
    },
    [toggleNotifMut],
  );
  const setActive = useCallback(
    (id: string) => {
      setActiveMut.mutate(id);
    },
    [setActiveMut],
  );

  const detectCurrent = useCallback(async () => {
    setDetectError(null);
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setDetectError("Geolocation isn't supported in this browser.");
      return;
    }
    setDetecting(true);
    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 10000,
          maximumAge: 60000,
        }),
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
        /* ignore */
      }
      await addMut.mutateAsync({
        name,
        region,
        country,
        lat: latitude,
        lon: longitude,
        label: "Current",
        notifications: true,
      });
    } catch (err) {
      const e = err as GeolocationPositionError | Error;
      const code = (e as GeolocationPositionError).code;
      if (code === 1) setDetectError("Location permission denied. Search for a city instead.");
      else if (code === 3) setDetectError("Location request timed out. Try again.");
      else setDetectError((e as Error).message || "Couldn't detect your location.");
    } finally {
      setDetecting(false);
    }
  }, [addMut]);

  const refresh = useCallback(() => {
    setRefreshTick((t) => t + 1);
    qc.invalidateQueries({ queryKey: ["saved_locations"] });
  }, [qc]);

  const value: Ctx = {
    locations,
    activeId,
    active,
    homeId,
    setActive,
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
    loading: locationsQ.isLoading,
  };

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
}

export function useLocation() {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error("useLocation must be used inside <LocationProvider>");
  return ctx;
}

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
