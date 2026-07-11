import { BookOpen } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { GlassCard } from "../glass-card";
import { faq } from "../../lib/mock/emergency";

export function KnowledgeHub() {
  return (
    <GlassCard className="col-span-12 lg:col-span-4">
      <div className="p-5 sm:p-6">
        <div className="mb-3 flex items-center gap-2">
          <BookOpen className="h-4 w-4" />
          <h3 className="font-display text-lg font-semibold">Knowledge hub</h3>
        </div>
        <ul className="space-y-2">
          {faq.slice(0, 4).map((f) => (
            <li key={f.id}>
              <Link to="/knowledge" className="block rounded-2xl border border-glass-border/50 bg-glass p-3 transition hover:border-primary/40">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-primary">{f.category}</div>
                <div className="mt-0.5 text-sm font-semibold">{f.title}</div>
                <div className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{f.summary}</div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </GlassCard>
  );
}
