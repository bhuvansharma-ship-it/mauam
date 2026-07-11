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

  const filtered = useMemo(() => {
    const list = query.data ?? [];
    return list
      .filter((a) => (search.severity ? a.severity === search.severity : true))
      .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));
  }, [query.data, search.severity]);

  const breaking = filtered.filter((a) => a.severity === "breaking").slice(0, 3);
  const featured = filtered[0];
  const feed = filtered.slice(1, pageSize);
  const trending = filtered.filter((a) => a.trending).slice(0, 6);
  const bulletins = filtered.filter((a) => a.source.official).slice(0, 4);
  const timeline = filtered.slice(0, 8);

  type S = z.infer<typeof searchSchema>;
  const setCategory = (c: string) => navigate({ search: (p: S) => ({ ...p, category: c }) });
  const setQ = (q: string) => navigate({ search: (p: S) => ({ ...p, q }) });
  const setSeverity = (s: string) => navigate({ search: (p: S) => ({ ...p, severity: s }) });

  return (
    <div className="space-y-6">
      {breaking.length > 0 && (
        <div className="rounded-3xl border border-news-breaking/50 bg-news-breaking/5 p-1">
          <div className="flex flex-col gap-3 rounded-[calc(1.25rem-4px)] bg-gradient-to-r from-news-breaking/20 via-transparent to-news-breaking/10 p-4 sm:flex-row sm:items-center sm:gap-6 sm:p-5">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-news-breaking px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white animate-pulse-alert">Breaking</span>
            </div>
            <div className="flex-1 space-y-1">
              {breaking.map((b) => (
                <a key={b.id} href={b.url ?? "#"} target="_blank" rel="noopener noreferrer" className="block font-display text-base font-semibold hover:underline sm:text-lg">
                  {b.headline}
                  <span className="ml-2 text-xs font-normal text-muted-foreground">· {b.source.name} · {timeAgo(b.publishedAt)}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

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
        className="flex flex-col gap-3 sm:flex-row sm:items-center"
      >
        <div className="flex flex-1 items-center gap-2 rounded-full border border-glass-border/60 bg-glass px-4 py-2.5">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
            placeholder={`Search news in ${active.name}…`}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          {search.q && (
            <button type="button" onClick={() => { setQueryInput(""); setQ(""); }} className="text-xs text-muted-foreground hover:text-foreground">clear</button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={search.severity}
            onChange={(e) => setSeverity(e.target.value)}
            className="rounded-full border border-glass-border/60 bg-glass px-3 py-2 text-sm outline-none"
          >
            <option value="">All severities</option>
            {(["breaking", "critical", "advisory", "official", "info"] as NewsSeverity[]).map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </form>

      <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={cn(
              "shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition",
              search.category === c ? "bg-primary text-primary-foreground" : "border border-glass-border/60 bg-glass hover:bg-accent/20",
            )}
          >{c}</button>
        ))}
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
          <GlassCard>
            <div className="p-5">
              <div className="mb-3 flex items-center gap-2">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-news-official/20"><TrendingUp className="h-3.5 w-3.5 text-news-official" /></span>
                <h3 className="font-display text-base font-semibold">Emergency bulletins</h3>
              </div>
              {bulletins.length === 0 ? (
                <p className="text-xs text-muted-foreground">No official bulletins in this feed right now.</p>
              ) : (
                <ul className="space-y-2">
                  {bulletins.map((a) => (
                    <li key={a.id}>
                      <a href={a.url ?? "#"} target="_blank" rel="noopener noreferrer" className="block rounded-xl border border-glass-border/50 bg-glass p-3 hover:border-news-official/50">
                        <div className="flex items-center gap-1.5"><SeverityBadge severity={a.severity} /><SourceBadge source={a.source} /></div>
                        <div className="mt-1 line-clamp-2 text-sm font-semibold">{a.headline}</div>
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </GlassCard>

          <GlassCard>
            <div className="p-5">
              <h3 className="mb-3 font-display text-base font-semibold">Trending topics</h3>
              <div className="flex flex-wrap gap-1.5">
                {trending.length === 0 ? (
                  <span className="text-xs text-muted-foreground">Nothing trending nearby.</span>
                ) : trending.map((a) => (
                  <a key={a.id} href={a.url ?? "#"} target="_blank" rel="noopener noreferrer" className="rounded-full border border-glass-border/60 bg-glass px-3 py-1 text-xs hover:border-primary/50">
                    <span className="mr-1 text-primary">#</span>{a.category}
                  </a>
                ))}
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="p-5">
              <h3 className="mb-3 font-display text-base font-semibold">Recent updates</h3>
              {timeline.length === 0 ? (
                <p className="text-xs text-muted-foreground">Waiting for updates…</p>
              ) : (
                <ol className="space-y-3">
                  {timeline.map((a) => (
                    <li key={a.id} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                        <div className="mt-1 h-full w-px bg-glass-border/60" />
                      </div>
                      <div className="pb-3">
                        <div className="text-[10px] text-muted-foreground">{timeAgo(a.publishedAt)}</div>
                        <a href={a.url ?? "#"} target="_blank" rel="noopener noreferrer" className="line-clamp-2 text-sm font-medium hover:text-primary">{a.headline}</a>
                      </div>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </GlassCard>
          <Link to="/bookmarks" className="block text-center text-xs text-muted-foreground hover:text-primary">View saved articles →</Link>
        </aside>
      </div>
    </div>
  );
}
