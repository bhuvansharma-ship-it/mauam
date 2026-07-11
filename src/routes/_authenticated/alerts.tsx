import { createFileRoute } from "@tanstack/react-router";
import { ShieldAlert, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { GlassCard } from "../../components/glass-card";
import { timeAgo } from "../../lib/format-time";
import { cn } from "../../lib/utils";
import { useLocation } from "../../lib/locations";
import { alertsQueryOptions } from "../../lib/alerts-query";

const style = {
  critical: "border-weather-critical/50",
  warning: "border-weather-warning/50",
  advisory: "border-weather-warning/30",
  info: "border-weather-rain/40",
} as const;

export const Route = createFileRoute("/_authenticated/alerts")({
  head: () => ({
    meta: [
      { title: "Active Alerts — Mausam" },
      { name: "description", content: "Real-time weather and public-safety alerts for your selected location." },
      { property: "og:title", content: "Active Alerts — Mausam" },
    ],
  }),
  component: AlertsPage,
});

function AlertsPage() {
  const { active } = useLocation();
  const { data: alerts = [], isLoading } = useQuery(alertsQueryOptions(active));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Active alerts</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {isLoading
            ? `Loading alerts for ${active.name}…`
            : `${alerts.length} alert${alerts.length !== 1 ? "s" : ""} currently active in ${active.name}${active.region ? `, ${active.region}` : ""}.`}
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Fetching latest alerts…
        </div>
      ) : alerts.length === 0 ? (
        <GlassCard className="p-8 text-center text-sm text-muted-foreground">
          No active alerts for {active.name} right now. We'll refresh automatically as new advisories are issued.
        </GlassCard>
      ) : (
        <div className="grid gap-4">
          {alerts.map((a) => (
            <GlassCard key={a.id} className={cn("border", style[a.severity])}>
              <div className="flex gap-4 p-5">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-weather-critical/20 text-weather-critical">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-weather-critical/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-weather-critical">{a.severity}</span>
                    <h3 className="font-display text-lg font-semibold">{a.title}</h3>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{a.body}</p>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span>{a.region}</span>
                    <span>Issued {timeAgo(a.issued)}</span>
                    <span>Source: {a.source}</span>
                  </div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
