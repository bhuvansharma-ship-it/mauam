import { Shield } from "lucide-react";
import { GlassCard } from "../glass-card";
import { useChecklist } from "../../lib/use-checklist";

export function PreparednessScore() {
  const { items } = useChecklist();
  const done = items.filter((i) => i.done).length;
  const pct = Math.round((done / items.length) * 100);
  const r = 52;
  const c = 2 * Math.PI * r;
  const dash = (pct / 100) * c;

  return (
    <GlassCard className="col-span-12 sm:col-span-6 lg:col-span-4" glow="accent">
      <div className="flex flex-col items-center gap-3 p-6">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          <Shield className="h-3.5 w-3.5" /> Preparedness
        </div>
        <div className="relative h-40 w-40">
          <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
            <circle cx="60" cy="60" r={r} stroke="var(--color-muted)" strokeWidth="10" fill="none" opacity="0.4" />
            <circle cx="60" cy="60" r={r} stroke="url(#prep-grad)" strokeWidth="10" fill="none" strokeLinecap="round" strokeDasharray={`${dash} ${c}`} />
            <defs>
              <linearGradient id="prep-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="var(--color-weather-safe)" />
                <stop offset="100%" stopColor="var(--color-primary)" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="font-display text-4xl font-bold tabular-nums">{pct}</div>
            <div className="text-[11px] text-muted-foreground">of 100</div>
          </div>
        </div>
        <div className="text-center text-sm">
          <div className="font-medium">{pct >= 80 ? "Well prepared" : pct >= 50 ? "Getting there" : "Needs attention"}</div>
          <div className="text-xs text-muted-foreground">{done} of {items.length} tasks complete</div>
        </div>
      </div>
    </GlassCard>
  );
}
