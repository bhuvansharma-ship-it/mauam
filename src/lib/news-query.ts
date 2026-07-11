import { queryOptions } from "@tanstack/react-query";
import { fetchNews } from "./news.functions";
import type { SavedLocation } from "./locations";

export function newsQueryOptions(params: {
  location: SavedLocation;
  category?: string;
  q?: string;
}) {
  const category = (params.category ?? "All") as
    | "All"
    | "Weather"
    | "Floods"
    | "Cyclones"
    | "Heatwaves"
    | "Storms"
    | "Landslides"
    | "Earthquakes"
    | "Wildfires"
    | "Public Safety"
    | "Health Advisories"
    | "Transportation"
    | "Government Alerts";
  const q = params.q ?? "";
  const loc = params.location;
  return queryOptions({
    queryKey: ["news", loc.id, category, q],
    queryFn: () =>
      fetchNews({
        data: {
          category,
          q,
          location: { name: loc.name, region: loc.region, country: loc.country },
        },
      }),
    staleTime: 5 * 60_000, // treat news as fresh for 5 min
    gcTime: 30 * 60_000, // keep cached feeds for 30 min after unmount
    refetchInterval: 5 * 60_000, // background refresh every 5 min (was 90s)
    refetchOnWindowFocus: false, // avoid a network hit on every tab focus
    refetchOnReconnect: true,
  });
}
