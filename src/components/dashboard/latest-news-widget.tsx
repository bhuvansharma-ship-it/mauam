import { Link } from "@tanstack/react-router";
import { ArrowRight, MapPin, Newspaper, RefreshCw } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { GlassCard } from "../glass-card";
import { NewsCard, NewsCardCompact, NewsCardSkeleton } from "../news/news-card";
import { useLocation } from "../../lib/locations";
import { newsQueryOptions } from "../../lib/news-query";
import type { Article } from "../../lib/mock/news";

const CHIPS = ["All", "Weather", "Public Safety", "Government Alerts"] as const;

const CHIP_TO_CATEGORY: Record<(typeof CHIPS)[number], string> = {
  All: "All",
  Weather: "Weather",
  "Public Safety": "Public Safety",
  "Government Alerts": "Government Alerts",
};

export function LatestNewsWidget() {
  const { active } = useLocation();
  const [chip, setChip] = useState<(typeof CHIPS)[number]>("All");
  const query = useQuery(newsQueryOptions({ location: active, category: CHIP_TO_CATEGORY[chip] }));

  const articles: Article[] = query.data ?? [];
  const featured = articles[0];
  const rest = articles.slice(1, 4);

  return (
    <GlassCard className="col-span-12 lg:col-span-8">
      <div className="p-5 sm:p-6">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Newspaper className="h-4 w-4" />
            <h3 className="font-display text-lg font-semibold">Latest news & emergency updates</h3>
          </div>
          <Link
            to="/news"
            className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            See all news <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {active.name}, {active.country}
          </span>
          <span>·</span>
          <span className="inline-flex items-center gap-1">
            <RefreshCw className={"h-3 w-3 " + (query.isFetching ? "animate-spin" : "")} />
            {query.isFetching ? "Updating…" : "Live"}
          </span>
        </div>
        <div className="mb-4 flex flex-wrap gap-1.5">
          {CHIPS.map((c) => (
            <button
              key={c}
              onClick={() => setChip(c)}
              className={
                "rounded-full px-3 py-1 text-xs font-medium transition " +
                (chip === c
                  ? "bg-primary text-primary-foreground"
                  : "border border-glass-border/60 bg-glass hover:bg-accent/20")
              }
            >
              {c}
            </button>
          ))}
        </div>
        {query.isLoading ? (
          <div className="grid gap-3 md:grid-cols-2">
            <NewsCardSkeleton />
            <div className="flex flex-col gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-20 animate-pulse rounded-2xl bg-muted/40" />
              ))}
            </div>
          </div>
        ) : featured ? (
          <div className="grid gap-3 md:grid-cols-2">
            <NewsCard article={featured} />
            <div className="flex flex-col gap-2">
              {rest.map((a) => (
                <NewsCardCompact key={a.id} article={a} />
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-glass-border/60 p-8 text-center text-sm text-muted-foreground">
            No stories for {active.name} right now. Try another category or location.
          </div>
        )}
      </div>
    </GlassCard>
  );
}
