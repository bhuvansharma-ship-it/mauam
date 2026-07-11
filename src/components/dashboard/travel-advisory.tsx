import { ArrowRight, Car, Route } from "lucide-react";
import { GlassCard } from "../glass-card";
import { cn } from "../../lib/utils";

const routes = [
  { from: "Downtown", to: "Home", eta: "34m", status: "clear", detail: "Via I-280 S", color: "safe" },
  { from: "Office", to: "Kids' School", eta: "12m", status: "slow", detail: "Wind delays on Bay Bridge", color: "warning" },
  { from: "Home", to: "Shelter", eta: "8m", status: "closed", detail: "Marina Blvd flooded — reroute", color: "critical" },
] as const;

const chipColor = {
  safe: "bg-weather-safe/15 text-weather-safe",
  warning: "bg-weather-warning/20 text-weather-warning",
  critical: "bg-weather-critical/15 text-weather-critical",
} as const;

export function TravelAdvisory() {
  return (
    <GlassCard className="col-span-12 sm:col-span-6 lg:col-span-4">
      <div className="p-5 sm:p-6">
        <div className="mb-3 flex items-center gap-2">
          <Route className="h-4 w-4" />
          <h3 className="font-display text-lg font-semibold">Travel advisory</h3>
        </div>
        <ul className="space-y-2">
          {routes.map((r, i) => (
            <li key={i} className="rounded-2xl border border-glass-border/50 bg-glass p-3">
              <div className="flex items-center justify-between gap-2 text-sm">
                <div className="flex min-w-0 items-center gap-1.5 truncate font-medium">
                  <Car className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{r.from}</span>
                  <ArrowRight className="h-3 w-3 shrink-0 text-muted-foreground" />
                  <span className="truncate">{r.to}</span>
                </div>
                <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider", chipColor[r.color])}>{r.status}</span>
              </div>
              <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                <span>{r.detail}</span>
                <span className="font-semibold tabular-nums text-foreground">{r.eta}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </GlassCard>
  );
}
