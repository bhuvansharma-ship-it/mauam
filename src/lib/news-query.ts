import { queryOptions } from "@tanstack/react-query";
import { fetchNews } from "./news.functions";
import type { SavedLocation } from "./locations";

export function newsQueryOptions(params: {
  location: SavedLocation;
  category?: string;
  q?: string;
}) {
  const category = (params.category ?? "All") as
    | "All" | "Weather" | "Floods" | "Cyclones" | "Heatwaves" | "Storms"
    | "Landslides" | "Earthquakes" | "Wildfires" | "Public Safety"
    | "Health Advisories" | "Transportation" | "Government Alerts";
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
    staleTime: 60_000,
    refetchInterval: 90_000,
    refetchOnWindowFocus: true,
  });
}
