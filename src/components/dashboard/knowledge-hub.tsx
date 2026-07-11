import { BookOpen } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { GlassCard } from "../glass-card";
import { knowledge } from "../../lib/knowledge";

export function KnowledgeHub() {
  return (
    <GlassCard className="col-span-12 lg:col-span-4">
      <div className="p-5 sm:p-6">
        <div className="mb-3 flex items-center gap-2">
          <BookOpen className="h-4 w-4" aria-hidden="true" />
          <h3 className="font-display text-lg font-semibold">Knowledge hub</h3>
        </div>
        <ul className="space-y-2">
          {knowledge.slice(0, 4).map((f) => {
            const Icon = f.icon;
            return (
              <li key={f.id}>
                <Link
                  to="/knowledge"
                  hash={f.slug}
                  className="flex items-start gap-3 rounded-2xl border border-glass-border/50 bg-glass p-3 transition hover:border-primary/40"
                >
                  <div
                    className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl"
                    style={{
                      backgroundImage: `linear-gradient(135deg, hsl(${f.hue} 85% 55%), hsl(${(f.hue + 40) % 360} 85% 55%))`,
                    }}
                  >
                    <Icon className="h-4 w-4 text-primary-foreground" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                      {f.category}
                    </div>
                    <div className="mt-0.5 text-sm font-semibold">{f.title}</div>
                    <div className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                      {f.summary}
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </GlassCard>
  );
}
