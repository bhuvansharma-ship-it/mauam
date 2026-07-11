import { createFileRoute } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { Filter, Search, TrendingUp } from "lucide-react";
import { useMemo, useState } from "react";
import { articles, type NewsCategory, type NewsSeverity } from "../lib/mock/news";
import { NewsCard, NewsCardSkeleton } from "../components/news/news-card";
import { GlassCard } from "../components/glass-card";
import { Link } from "@tanstack/react-router";
import { timeAgo } from "../lib/format-time";
import { cn } from "../lib/utils";
import { SourceBadge } from "../components/news/source-badge";
import { SeverityBadge } from "../components/news/severity-badge";

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

export const Route = createFileRoute("/news")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({
    meta: [
      { title: "Latest News & Emergency Updates — Aurora Guardian" },
      { name: "description", content: "Verified real-time news on weather, disasters, public safety, and government advisories." },
      { property: "og:title", content: "Latest News & Emergency Updates — Aurora Guardian" },
      { property: "og:description", content: "Verified real-time news on weather, disasters, public safety, and government advisories." },
    ],
  }),
  component: NewsPage,
});

function NewsPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const [pageSize, setPageSize] = useState(6);

  const filtered = useMemo(() => {
    return articles.filter((a) => {
      if (search.category !== "All" && a.category !== search.category) return false;
      if (search.severity && a.severity !== search.severity) return false;
      if (search.q) {
        const q = search.q.toLowerCase();
        if (!(`${a.headline} ${a.summary} ${a.location} ${a.source.name}`.toLowerCase().includes(q))) return false;
      }
      return true;
    }).sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) || +new Date(b.publishedAt) - +new Date(a.publishedAt));
  }, [search]);

  const breaking = articles.filter((a) => a.severity === "breaking");
  const featured = filtered[0];
  const feed = filtered.slice(1, pageSize);
  const trending = articles.filter((a) => a.trending).slice(0, 6);
  const bulletins = articles.filter((a) => a.source.official).slice(0, 4);
  const timeline = [...articles].sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt)).slice(0, 8);

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
                <Link key={b.id} to="/news/$slug" params={{ slug: b.slug }} className="block font-display text-base font-semibold hover:underline sm:text-lg">
                  {b.headline}
                  <span className="ml-2 text-xs font-normal text-muted-foreground">· {b.source.name} · {timeAgo(b.publishedAt)}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">News & Emergency Updates</h1>
        <p className="mt-1 text-sm text-muted-foreground">Verified reporting from official agencies and trusted news organizations.</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex flex-1 items-center gap-2 rounded-full border border-glass-border/60 bg-glass px-4 py-2.5">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={search.q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search headlines, locations, or sources…"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
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
      </div>

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
          {featured ? (
            <NewsCard article={featured} size="lg" />
          ) : (
            <div className="rounded-3xl border border-dashed border-glass-border/60 p-12 text-center">
              <div className="font-display text-lg font-semibold">No news matches your filters</div>
              <p className="mt-1 text-sm text-muted-foreground">Try clearing your search or picking a different category.</p>
              <button onClick={() => navigate({ search: { category: "All", q: "", severity: "" } })} className="mt-4 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground">Reset filters</button>
            </div>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            {feed.map((a) => <NewsCard key={a.id} article={a} />)}
            {feed.length === 0 && featured && Array.from({ length: 2 }).map((_, i) => <NewsCardSkeleton key={i} />)}
          </div>
          {filtered.length > pageSize && (
            <div className="flex justify-center">
              <button onClick={() => setPageSize((n) => n + 6)} className="rounded-full border border-glass-border/60 bg-glass px-5 py-2.5 text-sm font-medium hover:bg-accent/20">Load more stories</button>
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
              <ul className="space-y-2">
                {bulletins.map((a) => (
                  <li key={a.id}>
                    <Link to="/news/$slug" params={{ slug: a.slug }} className="block rounded-xl border border-glass-border/50 bg-glass p-3 hover:border-news-official/50">
                      <div className="flex items-center gap-1.5"><SeverityBadge severity={a.severity} /><SourceBadge source={a.source} /></div>
                      <div className="mt-1 line-clamp-2 text-sm font-semibold">{a.headline}</div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="p-5">
              <h3 className="mb-3 font-display text-base font-semibold">Trending topics</h3>
              <div className="flex flex-wrap gap-1.5">
                {trending.map((a) => (
                  <Link key={a.id} to="/news/$slug" params={{ slug: a.slug }} className="rounded-full border border-glass-border/60 bg-glass px-3 py-1 text-xs hover:border-primary/50">
                    <span className="mr-1 text-primary">#</span>{a.category}
                  </Link>
                ))}
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="p-5">
              <h3 className="mb-3 font-display text-base font-semibold">Recent updates</h3>
              <ol className="space-y-3">
                {timeline.map((a) => (
                  <li key={a.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <div className="mt-1 h-full w-px bg-glass-border/60" />
                    </div>
                    <div className="pb-3">
                      <div className="text-[10px] text-muted-foreground">{timeAgo(a.publishedAt)}</div>
                      <Link to="/news/$slug" params={{ slug: a.slug }} className="line-clamp-2 text-sm font-medium hover:text-primary">{a.headline}</Link>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </GlassCard>
        </aside>
      </div>
    </div>
  );
}
