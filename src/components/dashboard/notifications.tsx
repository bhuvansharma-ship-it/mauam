import { Bell, CloudRain, ExternalLink, MapPin, Newspaper, RefreshCw, Shield } from "lucide-react";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { GlassCard } from "../glass-card";
import { useLocation } from "../../lib/locations";
import { newsQueryOptions } from "../../lib/news-query";
import { timeAgo } from "../../lib/format-time";
import type { Article, NewsSeverity } from "../../lib/mock/news";
import { ReadAloudButton } from "../read-aloud-button";

const SEVERITY_WEIGHT: Record<NewsSeverity, number> = {
  breaking: 4,
  critical: 3,
  official: 2,
  advisory: 1,
  info: 0,
};

function kindFor(a: Article): "alert" | "news" | "system" {
  if (a.severity === "breaking" || a.severity === "critical") return "alert";
  if (a.severity === "official" || a.source.official) return "system";
  return "news";
}

const iconFor = { alert: CloudRain, news: Newspaper, system: Shield };
const toneFor = {
  alert: "bg-destructive/15 text-destructive",
  news: "bg-accent/15",
  system: "bg-primary/15 text-primary",
};

export function Notifications() {
  const { active } = useLocation();
  const query = useQuery(newsQueryOptions({ location: active, category: "All" }));

  const items = useMemo(() => {
    const arr = query.data ?? [];
    return [...arr]
      .sort((a, b) => {
        const s = SEVERITY_WEIGHT[b.severity] - SEVERITY_WEIGHT[a.severity];
        if (s !== 0) return s;
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      })
      .slice(0, 6);
  }, [query.data]);

  return (
    <GlassCard className="col-span-12 sm:col-span-6 lg:col-span-4">
      <div className="p-5 sm:p-6">
        <div className="mb-1 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4" aria-hidden="true" />
            <h3 className="font-display text-lg font-semibold">Recent notifications</h3>
          </div>
          {items.length > 0 ? (
            <ReadAloudButton
              text={items
                .slice(0, 5)
                .map((a, i) => `${i + 1}. ${a.headline}.`)
                .join(" ")}
            />
          ) : null}
        </div>
        <div className="mb-3 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3 w-3" aria-hidden="true" />
            {active.name}
            {active.country ? `, ${active.country}` : ""}
          </span>
          <span aria-hidden="true">·</span>
          <span className="inline-flex items-center gap-1">
            <RefreshCw
              className={"h-3 w-3 " + (query.isFetching ? "animate-spin" : "")}
              aria-hidden="true"
            />
            {query.isFetching ? "Updating…" : "From Google News"}
          </span>
        </div>

        {query.isLoading ? (
          <ul className="space-y-2" aria-hidden="true">
            {Array.from({ length: 4 }).map((_, i) => (
              <li key={i} className="h-14 animate-pulse rounded-2xl bg-muted/40" />
            ))}
          </ul>
        ) : items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-glass-border/60 p-6 text-center text-xs text-muted-foreground">
            No notifications for {active.name} right now.
          </div>
        ) : (
          <ul className="space-y-2">
            {items.map((a) => {
              const kind = kindFor(a);
              const Icon = iconFor[kind];
              const content = (
                <>
                  <div
                    className={
                      "mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-xl " + toneFor[kind]
                    }
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="line-clamp-2 text-sm">{a.headline}</div>
                    <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <span className="truncate">{a.source.name}</span>
                      <span aria-hidden="true">·</span>
                      <span>{timeAgo(a.publishedAt)}</span>
                      {a.url ? (
                        <ExternalLink className="h-3 w-3 shrink-0" aria-hidden="true" />
                      ) : null}
                    </div>
                  </div>
                </>
              );
              const className =
                "flex items-start gap-3 rounded-2xl border border-glass-border/50 bg-glass p-3 transition hover:bg-accent/10";
              return (
                <li key={a.id}>
                  {a.url ? (
                    <a
                      href={a.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={className}
                      aria-label={`${a.headline} — opens ${a.source.name} in a new tab`}
                    >
                      {content}
                    </a>
                  ) : (
                    <div className={className}>{content}</div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </GlassCard>
  );
}
