import { createFileRoute } from "@tanstack/react-router";
import { Bookmark } from "lucide-react";
import { useBookmarks } from "../../lib/use-bookmarks";
import { NewsCard } from "../../components/news/news-card";

export const Route = createFileRoute("/_authenticated/bookmarks")({
  head: () => ({
    meta: [
      { title: "Saved Articles — Mausam" },
      { name: "description", content: "Your saved news articles and advisories." },
      { property: "og:title", content: "Saved Articles — Mausam" },
    ],
  }),
  component: BookmarksPage,
});

function BookmarksPage() {
  const { articles } = useBookmarks();
  const saved = articles();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Saved articles</h1>
        <p className="mt-1 text-sm text-muted-foreground">{saved.length} bookmarked stor{saved.length === 1 ? "y" : "ies"}.</p>
      </div>
      {saved.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-glass-border/60 p-12 text-center">
          <Bookmark className="mx-auto h-8 w-8 text-muted-foreground" />
          <div className="mt-3 font-display text-lg font-semibold">No bookmarks yet</div>
          <p className="mt-1 text-sm text-muted-foreground">Tap the bookmark icon on any article to save it here.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {saved.map((a) => <NewsCard key={a.id} article={a} />)}
        </div>
      )}
    </div>
  );
}
