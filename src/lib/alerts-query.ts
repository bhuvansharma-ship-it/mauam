import { queryOptions } from "@tanstack/react-query";
import { fetchNews } from "./news.functions";
import type { SavedLocation } from "./locations";
import type { Alert, Severity } from "./mock/alerts";
import type { Article } from "./mock/news";

function toAlertSeverity(s: Article["severity"]): Severity {
  if (s === "breaking" || s === "critical") return "critical";
  if (s === "advisory") return "advisory";
  if (s === "official") return "warning";
  return "info";
}

const ALERT_CATEGORIES = new Set<Article["category"]>([
  "Floods",
  "Cyclones",
  "Heatwaves",
  "Storms",
  "Landslides",
  "Earthquakes",
  "Wildfires",
  "Public Safety",
  "Health Advisories",
  "Government Alerts",
  "Weather",
]);

export function alertsQueryOptions(location: SavedLocation) {
  return queryOptions({
    queryKey: ["alerts", location.id],
    queryFn: async (): Promise<Alert[]> => {
      const articles = await fetchNews({
        data: {
          category: "All",
          q: "alert OR warning OR advisory OR emergency OR evacuation",
          location: { name: location.name, region: location.region, country: location.country },
        },
      });
      return articles
        .filter((a) => ALERT_CATEGORIES.has(a.category))
        .filter((a) => a.severity !== "info")
        .slice(0, 20)
        .map((a) => ({
          id: a.id,
          title: a.headline,
          body: a.summary,
          severity: toAlertSeverity(a.severity),
          region: a.location,
          issued: a.publishedAt,
          expires: a.publishedAt,
          source: a.source.name,
        }));
    },
    staleTime: 60_000,
    refetchInterval: 120_000,
    refetchOnWindowFocus: true,
  });
}
