import { timeAgo } from "../../lib/format-time";
import type { Article } from "../../lib/mock/news";

export function BreakingBanner({ items }: { items: NewsArticle[] }) {
  if (items.length === 0) return null;
  return (
    <div className="rounded-3xl border border-news-breaking/50 bg-news-breaking/5 p-1">
      <div className="flex flex-col gap-3 rounded-[calc(1.25rem-4px)] bg-gradient-to-r from-news-breaking/20 via-transparent to-news-breaking/10 p-4 sm:flex-row sm:items-center sm:gap-6 sm:p-5">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-news-breaking px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white animate-pulse-alert">Breaking</span>
        </div>
        <div className="flex-1 space-y-1">
          {items.map((b) => (
            <a key={b.id} href={b.url ?? "#"} target="_blank" rel="noopener noreferrer" className="block font-display text-base font-semibold hover:underline sm:text-lg">
              {b.headline}
              <span className="ml-2 text-xs font-normal text-muted-foreground">· {b.source.name} · {timeAgo(b.publishedAt)}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
