import { TrendingUp } from "lucide-react";
import { GlassCard } from "../glass-card";
import { SeverityBadge } from "./severity-badge";
import { SourceBadge } from "./source-badge";
import { timeAgo } from "../../lib/format-time";
import type { Article } from "../../lib/mock/news";

export function NewsSidebar({
  bulletins,
  trending,
  timeline,
}: {
  bulletins: Article[];
  trending: Article[];
  timeline: Article[];
}) {
  return (
    <>
      <GlassCard>
        <div className="p-5">
          <div className="mb-3 flex items-center gap-2">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-news-official/20">
              <TrendingUp className="h-3.5 w-3.5 text-news-official" aria-hidden="true" />
            </span>
            <h3 className="font-display text-base font-semibold">Emergency bulletins</h3>
          </div>
          {bulletins.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              No official bulletins in this feed right now.
            </p>
          ) : (
            <ul className="space-y-2">
              {bulletins.map((a) => (
                <li key={a.id}>
                  <a
                    href={a.url ?? "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-xl border border-glass-border/50 bg-glass p-3 hover:border-news-official/50"
                  >
                    <div className="flex items-center gap-1.5">
                      <SeverityBadge severity={a.severity} />
                      <SourceBadge source={a.source} />
                    </div>
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
            ) : (
              trending.map((a) => (
                <a
                  key={a.id}
                  href={a.url ?? "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-glass-border/60 bg-glass px-3 py-1 text-xs hover:border-primary/50"
                >
                  <span className="mr-1 text-primary">#</span>
                  {a.category}
                </a>
              ))
            )}
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
                  <div className="flex flex-col items-center" aria-hidden="true">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <div className="mt-1 h-full w-px bg-glass-border/60" />
                  </div>
                  <div className="pb-3">
                    <div className="text-[10px] text-muted-foreground">
                      {timeAgo(a.publishedAt)}
                    </div>
                    <a
                      href={a.url ?? "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="line-clamp-2 text-sm font-medium hover:text-primary"
                    >
                      {a.headline}
                    </a>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>
      </GlassCard>
    </>
  );
}
