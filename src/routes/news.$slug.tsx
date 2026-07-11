import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Bookmark, ChevronLeft, Flag, MapPin, Share2 } from "lucide-react";
import { articles, findArticle } from "../lib/mock/news";
import { NewsImage } from "../components/news/news-image";
import { SeverityBadge } from "../components/news/severity-badge";
import { SourceBadge } from "../components/news/source-badge";
import { NewsCard } from "../components/news/news-card";
import { GlassCard } from "../components/glass-card";
import { timeAgo } from "../lib/format-time";
import { useBookmarks } from "../lib/use-bookmarks";
import { shareOrCopy } from "../lib/share";
import { cn } from "../lib/utils";

export const Route = createFileRoute("/news/$slug")({
  loader: ({ params }) => {
    const a = findArticle(params.slug);
    if (!a) throw notFound();
    return { article: a };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Article not found — Aurora Guardian" }, { name: "robots", content: "noindex" }] };
    const a = loaderData.article;
    return {
      meta: [
        { title: `${a.headline} — Aurora Guardian` },
        { name: "description", content: a.summary },
        { property: "og:title", content: a.headline },
        { property: "og:description", content: a.summary },
        { property: "og:type", content: "article" },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-md py-16 text-center">
      <h2 className="font-display text-2xl font-bold">Article not found</h2>
      <p className="mt-2 text-sm text-muted-foreground">The story you're looking for isn't available.</p>
      <Link to="/news" className="mt-4 inline-flex rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Back to news</Link>
    </div>
  ),
  component: ArticleDetail,
});

function ArticleDetail() {
  const { article: a } = Route.useLoaderData();
  const { has, toggle } = useBookmarks();
  const bookmarked = has(a.id);
  const related = articles.filter((r) => r.id !== a.id && (r.category === a.category || r.location === a.location)).slice(0, 3);

  return (
    <article className="mx-auto max-w-4xl space-y-6">
      <Link to="/news" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ChevronLeft className="h-4 w-4" /> Back to news
      </Link>

      <GlassCard>
        <NewsImage article={a} className="h-64 sm:h-96" />
        <div className="space-y-4 p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <SeverityBadge severity={a.severity} />
            <span className="rounded-full bg-accent/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider">{a.category}</span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" />{a.location}</span>
          </div>
          <h1 className="font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl">{a.headline}</h1>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-glass-border/60 pb-4">
            <div className="flex items-center gap-3">
              <SourceBadge source={a.source} />
              <span className="text-xs text-muted-foreground">Published {timeAgo(a.publishedAt)}</span>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => toggle(a.id)} className={cn("flex items-center gap-1.5 rounded-full border border-glass-border/60 bg-glass px-3 py-1.5 text-xs font-medium hover:bg-accent/20", bookmarked && "border-primary/50 text-primary")}>
                <Bookmark className={cn("h-3.5 w-3.5", bookmarked && "fill-primary")} /> {bookmarked ? "Saved" : "Save"}
              </button>
              <button onClick={() => shareOrCopy({ title: a.headline, text: a.summary, url: typeof window !== "undefined" ? window.location.href : `/news/${a.slug}` })} className="flex items-center gap-1.5 rounded-full border border-glass-border/60 bg-glass px-3 py-1.5 text-xs font-medium hover:bg-accent/20">
                <Share2 className="h-3.5 w-3.5" /> Share
              </button>
              <button className="flex items-center gap-1.5 rounded-full border border-glass-border/60 bg-glass px-3 py-1.5 text-xs font-medium hover:bg-accent/20">
                <Flag className="h-3.5 w-3.5" /> Report
              </button>
            </div>
          </div>
          <p className="text-lg leading-relaxed text-foreground/90">{a.summary}</p>
          <div className="space-y-4 text-[15px] leading-relaxed text-foreground/80">
            {a.body.split("\n\n").map((p, i) => <p key={i}>{p}</p>)}
          </div>
        </div>
      </GlassCard>

      {related.length > 0 && (
        <section>
          <h2 className="mb-3 font-display text-xl font-semibold">Related stories</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {related.map((r) => <NewsCard key={r.id} article={r} size="sm" />)}
          </div>
        </section>
      )}
    </article>
  );
}
