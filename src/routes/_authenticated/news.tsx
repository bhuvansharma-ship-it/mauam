import { createFileRoute, Link } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { Filter, MapPin, RefreshCw, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { NewsCategory, NewsSeverity } from "../../lib/mock/news";
import { NewsCard, NewsCardSkeleton } from "../../components/news/news-card";
import { BreakingBanner } from "../../components/news/breaking-banner";
import { NewsSidebar } from "../../components/news/news-sidebar";
import { cn } from "../../lib/utils";
import { useLocation } from "../../lib/locations";
import { newsQueryOptions } from "../../lib/news-query";

const CATEGORIES: (NewsCategory | "All")[] = [
  "All", "Weather", "Floods", "Cyclones", "Heatwaves", "Storms",
  "Landslides", "Earthquakes", "Wildfires", "Public Safety",
  "Health Advisories", "Transportation", "Government Alerts",
];

const searchSchema = z.object({
  category: fallback(z.string(), "All").default("All"),
  q: fallback(z.string(), "").default(""),
  severity: fallback(z.string(), "").default(""),
});

export const Route = createFileRoute("/_authenticated/news")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({
    meta: [
      { title: "Latest News & Emergency Updates — Mausam" },
      { name: "description", content: "Verified real-time news on weather, disasters, public safety, and government advisories for your location." },
      { property: "og:title", content: "Latest News & Emergency Updates — Mausam" },
      { property: "og:description", content: "Verified real-time news on weather, disasters, public safety, and government advisories." },
    ],
  }),
  component: NewsPage,
});

function NewsPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const { active } = useLocation();
  const [pageSize, setPageSize] = useState(6);
  const [queryInput, setQueryInput] = useState(search.q);

  const query = useQuery(
    newsQueryOptions({ location: active, category: search.category, q: search.q }),
  );

  // Sidebar/breaking sections pull from ALL categories, independent of filters
  const allQuery = useQuery(
    newsQueryOptions({ location: active, category: "All", q: "" }),
  );

  const filtered = useMemo(() => {
    const list = query.data ?? [];
    return list
      .filter((a) => (search.severity ? a.severity === search.severity : true))
      .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));
  }, [query.data, search.severity]);

  const allSorted = useMemo(() => {
    const list = allQuery.data ?? [];
    return [...list].sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));
  }, [allQuery.data]);

  const breaking = allSorted.filter((a) => a.severity === "breaking").slice(0, 3);
  const featured = filtered[0];
  const feed = filtered.slice(1, pageSize);
  const trending = allSorted.filter((a) => a.trending).slice(0, 6);
  const bulletins = allSorted.filter((a) => a.source.official).slice(0, 4);
  const timeline = allSorted.slice(0, 8);


  type S = z.infer<typeof searchSchema>;
  const setCategory = (c: string) => navigate({ search: (p: S) => ({ ...p, category: c }) });
  const setQ = (q: string) => navigate({ search: (p: S) => ({ ...p, q }) });
  const setSeverity = (s: string) => navigate({ search: (p: S) => ({ ...p, severity: s }) });

  return (
    <div className="space-y-6">
      <BreakingBanner items={breaking} />

      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">News & Emergency Updates</h1>
          <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />Showing for <strong className="text-foreground">{active.name}, {active.country}</strong></span>
            <span>·</span>
            <span className="inline-flex items-center gap-1">
              <RefreshCw className={"h-3.5 w-3.5 " + (query.isFetching ? "animate-spin" : "")} />
              {query.isFetching ? "Updating" : "Live · auto-refreshes"}
            </span>
          </p>
        </div>
        <button
          onClick={() => query.refetch()}
          className="rounded-full border border-glass-border/60 bg-glass px-3 py-1.5 text-xs font-medium hover:bg-accent/20"
        >
          Refresh now
        </button>
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); setQ(queryInput); }}
        role="search"
        aria-label="Search news"
        className="flex flex-col gap-3 sm:flex-row sm:items-center"
      >
        <div className="flex flex-1 items-center gap-2 rounded-full border border-glass-border/60 bg-glass px-4 py-2.5 focus-within:ring-2 focus-within:ring-ring">
          <Search className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <label htmlFor="news-search" className="sr-only">Search news</label>
          <input
            id="news-search"
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
            placeholder={`Search news in ${active.name}…`}
            className="min-h-6 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          {search.q && (
            <button type="button" onClick={() => { setQueryInput(""); setQ(""); }} aria-label="Clear search" className="text-xs text-muted-foreground hover:text-foreground">clear</button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <label htmlFor="news-severity" className="sr-only">Filter by severity</label>
          <select
            id="news-severity"
            value={search.severity}
            onChange={(e) => setSeverity(e.target.value)}
            className="min-h-11 rounded-full border border-glass-border/60 bg-glass px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">All severities</option>
            {(["breaking", "critical", "advisory", "official", "info"] as NewsSeverity[]).map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </form>

      <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1" role="group" aria-label="News categories">
        {CATEGORIES.map((c) => {
          const active = search.category === c;
          return (
            <button
              key={c}
              onClick={() => setCategory(c)}
              aria-pressed={active}
              className={cn(
                "shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                active ? "bg-primary text-primary-foreground" : "border border-glass-border/60 bg-glass hover:bg-accent/20",
              )}
            >{c}</button>
          );
        })}
      </div>

      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 space-y-5 lg:col-span-8">
          {query.isLoading ? (
            <>
              <NewsCardSkeleton />
              <div className="grid gap-4 sm:grid-cols-2">
                <NewsCardSkeleton />
                <NewsCardSkeleton />
              </div>
            </>
          ) : featured ? (
            <>
              <NewsCard article={featured} size="lg" />
              <div className="grid gap-4 sm:grid-cols-2">
                {feed.map((a) => <NewsCard key={a.id} article={a} />)}
              </div>
              {filtered.length > pageSize && (
                <div className="flex justify-center">
                  <button onClick={() => setPageSize((n) => n + 6)} className="rounded-full border border-glass-border/60 bg-glass px-5 py-2.5 text-sm font-medium hover:bg-accent/20">Load more stories</button>
                </div>
              )}
            </>
          ) : (
            <div className="rounded-3xl border border-dashed border-glass-border/60 p-12 text-center">
              <div className="font-display text-lg font-semibold">No news matches your filters</div>
              <p className="mt-1 text-sm text-muted-foreground">Try clearing your search, picking a different category, or switching location.</p>
              <button onClick={() => { setQueryInput(""); navigate({ search: { category: "All", q: "", severity: "" } }); }} className="mt-4 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground">Reset filters</button>
            </div>
          )}
        </div>

        <aside className="col-span-12 space-y-5 lg:col-span-4">
          <NewsSidebar bulletins={bulletins} trending={trending} timeline={timeline} />
          <Link to="/bookmarks" className="block text-center text-xs text-muted-foreground hover:text-primary">View saved articles →</Link>
        </aside>
      </div>
    </div>
  );
}
