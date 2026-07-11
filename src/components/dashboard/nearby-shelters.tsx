import { Building2, Users } from "lucide-react";
import { GlassCard } from "../glass-card";
import { shelters } from "../../lib/mock/emergency";

export function NearbyShelters() {
  return (
    <GlassCard className="col-span-12 sm:col-span-6 lg:col-span-4">
      <div className="p-5 sm:p-6">
        <div className="mb-3 flex items-center gap-2">
          <Building2 className="h-4 w-4" />
          <h3 className="font-display text-lg font-semibold">Nearby shelters</h3>
        </div>
        <ul className="space-y-2">
          {shelters.map((s) => {
            const pct = Math.round((s.filled / s.capacity) * 100);
            return (
              <li key={s.id} className="rounded-2xl border border-glass-border/50 bg-glass p-3">
                <div className="flex items-baseline justify-between gap-2">
                  <div className="min-w-0 truncate text-sm font-semibold">{s.name}</div>
                  <div className="shrink-0 text-xs text-muted-foreground tabular-nums">
                    {s.distanceMi} mi
                  </div>
                </div>
                <div className="mt-0.5 truncate text-xs text-muted-foreground">{s.address}</div>
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 h-1.5 overflow-hidden rounded-full bg-muted/60">
                    <div
                      className="h-full rounded-full bg-weather-safe"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="flex shrink-0 items-center gap-1 text-[11px] tabular-nums text-muted-foreground">
                    <Users className="h-3 w-3" />
                    {s.filled}/{s.capacity}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {s.amenities.map((a) => (
                    <span
                      key={a}
                      className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-medium"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </GlassCard>
  );
}
