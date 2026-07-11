import { Bookmark, MapPin, Pin, Share2 } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { Article } from "../../lib/mock/news";
import { timeAgo } from "../../lib/format-time";
import { useBookmarks } from "../../lib/use-bookmarks";
import { shareOrCopy } from "../../lib/share";
import { SeverityBadge } from "./severity-badge";
import { SourceBadge } from "./source-badge";
import { NewsImage } from "./news-image";
import { cn } from "../../lib/utils";

export function NewsCard({ article, size = "md" }: { article: Article; size?: "sm" | "md" | "lg" }) {
  const { has, toggle } = useBookmarks();
  const bookmarked = has(article.id);
  const isCritical = article.severity === "breaking" || article.severity === "critical";

  return (
    <article className={cn(
      "group relative overflow-hidden rounded-3xl border bg-glass transition hover:-translate-y-0.5 hover:shadow-2xl",
      isCritical ? "border-news-breaking/50" : "border-glass-border/60",
    )}>
      {article.pinned && (
        <div className="absolute right-3 top-3 z-10 flex items-center gap-1 rounded-full bg-news-official/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
          <Pin className="h-3 w-3" /> Pinned
        </div>
      )}
      <NewsImage article={article} className={size === "lg" ? "h-56 sm:h-72" : size === "sm" ? "h-32" : "h-44"} />
      <div className="flex flex-col gap-2 p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-2">
          <SeverityBadge severity={article.severity} />
          <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent-foreground">{article.category}</span>
        </div>
        {article.url ? (
          <a href={article.url} target="_blank" rel="noopener noreferrer" className="block">
            <h3 className={cn(
              "font-display font-semibold leading-tight tracking-tight transition group-hover:text-primary",
              size === "lg" ? "text-2xl sm:text-3xl" : size === "sm" ? "text-sm" : "text-lg",
            )}>{article.headline}</h3>
          </a>
        ) : (
          <Link to="/news/$slug" params={{ slug: article.slug }} className="block">
            <h3 className={cn(
              "font-display font-semibold leading-tight tracking-tight transition group-hover:text-primary",
              size === "lg" ? "text-2xl sm:text-3xl" : size === "sm" ? "text-sm" : "text-lg",
            )}>{article.headline}</h3>
          </Link>
        )}
        {size !== "sm" && <p className="line-clamp-2 text-sm text-muted-foreground">{article.summary}</p>}
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
          <SourceBadge source={article.source} />
          <span className="flex items-center gap-1 text-muted-foreground"><MapPin className="h-3 w-3" />{article.location}</span>
          <span className="text-muted-foreground">· {timeAgo(article.publishedAt)}</span>
          <div className="ml-auto flex items-center gap-1">
            <button
              onClick={(e) => { e.preventDefault(); toggle(article.id); }}
              className="grid h-8 w-8 place-items-center rounded-full hover:bg-accent/20"
              aria-label="Bookmark"
            >
              <Bookmark className={cn("h-4 w-4", bookmarked && "fill-primary text-primary")} />
            </button>
            <button
              onClick={(e) => { e.preventDefault(); shareOrCopy({ title: article.headline, text: article.summary, url: typeof window !== "undefined" ? `${window.location.origin}/news/${article.slug}` : `/news/${article.slug}` }); }}
              className="grid h-8 w-8 place-items-center rounded-full hover:bg-accent/20"
              aria-label="Share"
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export function NewsCardCompact({ article }: { article: Article }) {
  return (
    <Link to="/news/$slug" params={{ slug: article.slug }} className="group flex gap-3 rounded-2xl border border-glass-border/50 bg-glass p-2.5 transition hover:border-primary/40">
      <NewsImage article={article} className="h-20 w-24 shrink-0 rounded-xl" />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-center gap-1.5">
          <SeverityBadge severity={article.severity} />
          <span className="text-[10px] text-muted-foreground">{timeAgo(article.publishedAt)}</span>
        </div>
        <div className="line-clamp-2 text-sm font-semibold leading-snug group-hover:text-primary">{article.headline}</div>
        <SourceBadge source={article.source} />
      </div>
    </Link>
  );
}

export function NewsCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl border border-glass-border/60 bg-glass">
      <div className="h-44 animate-pulse bg-muted/40" />
      <div className="space-y-3 p-5">
        <div className="h-3 w-20 animate-pulse rounded-full bg-muted/40" />
        <div className="h-5 w-4/5 animate-pulse rounded-full bg-muted/40" />
        <div className="h-3 w-full animate-pulse rounded-full bg-muted/40" />
        <div className="h-3 w-2/3 animate-pulse rounded-full bg-muted/40" />
      </div>
    </div>
  );
}
