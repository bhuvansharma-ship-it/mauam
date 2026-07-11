import { Link } from "@tanstack/react-router";
import { ArrowRight, Newspaper } from "lucide-react";
import { useState } from "react";
import { GlassCard } from "../glass-card";
import { articles } from "../../lib/mock/news";
import { NewsCard, NewsCardCompact } from "../news/news-card";

const CHIPS = ["All", "Weather", "Public Safety", "Government Alerts"] as const;

export function LatestNewsWidget() {
  const [chip, setChip] = useState<(typeof CHIPS)[number]>("All");
  const filtered = articles.filter((a) => {
    if (chip === "All") return true;
    if (chip === "Weather") return ["Weather", "Storms", "Floods", "Cyclones", "Heatwaves", "Wildfires", "Landslides", "Earthquakes"].includes(a.category);
    if (chip === "Government Alerts") return a.category === "Government Alerts";
    if (chip === "Public Safety") return ["Public Safety", "Health Advisories", "Transportation"].includes(a.category);
    return true;
  }).sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
  const featured = filtered[0];
  const rest = filtered.slice(1, 4);

  return (
    <GlassCard className="col-span-12 lg:col-span-8">
      <div className="p-5 sm:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Newspaper className="h-4 w-4" />
            <h3 className="font-display text-lg font-semibold">Latest news & emergency updates</h3>
          </div>
          <Link to="/news" className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">See all news <ArrowRight className="h-3 w-3" /></Link>
        </div>
        <div className="mb-4 flex flex-wrap gap-1.5">
          {CHIPS.map((c) => (
            <button key={c} onClick={() => setChip(c)} className={"rounded-full px-3 py-1 text-xs font-medium transition " + (chip === c ? "bg-primary text-primary-foreground" : "border border-glass-border/60 bg-glass hover:bg-accent/20")}>{c}</button>
          ))}
        </div>
        {featured ? (
          <div className="grid gap-3 md:grid-cols-2">
            <NewsCard article={featured} />
            <div className="flex flex-col gap-2">
              {rest.map((a) => <NewsCardCompact key={a.id} article={a} />)}
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-glass-border/60 p-8 text-center text-sm text-muted-foreground">No stories in this category right now.</div>
        )}
      </div>
    </GlassCard>
  );
}
