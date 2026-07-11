import { ShieldAlert, X } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { timeAgo } from "../../lib/format-time";
import { cn } from "../../lib/utils";
import { Link } from "@tanstack/react-router";
import { useLocation } from "../../lib/locations";
import { alertsQueryOptions } from "../../lib/alerts-query";
import { ReadAloudButton } from "../read-aloud-button";

const styleFor = {
  critical: "border-weather-critical/50 bg-weather-critical/10",
  warning: "border-weather-warning/50 bg-weather-warning/10",
  advisory: "border-weather-warning/40 bg-weather-warning/5",
  info: "border-weather-rain/40 bg-weather-rain/5",
} as const;

export function AlertBanner() {
  const [dismissed, setDismissed] = useState<string[]>([]);
  const { active } = useLocation();
  const { data: alerts = [] } = useQuery(alertsQueryOptions(active));
  const top = alerts.find((a) => a.severity === "critical" && !dismissed.includes(a.id));
  if (!top) return null;
  return (
    <div
      className={cn(
        "col-span-12 flex items-center gap-4 rounded-3xl border p-4 pr-3 sm:p-5",
        styleFor[top.severity],
      )}
    >
      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-weather-critical text-white animate-pulse-alert">
        <ShieldAlert className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-weather-critical px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
            Critical
          </span>
          <span className="font-display text-base font-semibold sm:text-lg">{top.title}</span>
          <span className="text-xs text-muted-foreground">
            · {top.region} · {timeAgo(top.issued)}
          </span>
        </div>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{top.body}</p>
        <div className="mt-2">
          <ReadAloudButton text={`${top.title}. ${top.body}`} />
        </div>
      </div>
      <Link
        to="/alerts"
        className="hidden shrink-0 rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background hover:opacity-90 sm:inline-flex"
      >
        View details
      </Link>
      <button
        aria-label="Dismiss"
        onClick={() => setDismissed((d) => [...d, top.id])}
        className="grid h-9 w-9 shrink-0 place-items-center rounded-full hover:bg-background/40"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
