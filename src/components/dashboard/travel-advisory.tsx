import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Car,
  CloudRain,
  Droplets,
  MapPin,
  Route as RouteIcon,
  Snowflake,
  Sun,
  Thermometer,
  Umbrella,
  Wind,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { GlassCard } from "../glass-card";
import { cn } from "../../lib/utils";
import { useRecentTrips, type RecentTrip } from "../../hooks/use-recent-trips";
import { timeAgo } from "../../lib/format-time";

const chipColor: Record<RecentTrip["level"], string> = {
  safe: "bg-weather-safe/15 text-weather-safe",
  caution: "bg-weather-warning/20 text-weather-warning",
  warning: "bg-weather-warning/25 text-weather-warning",
  danger: "bg-weather-critical/15 text-weather-critical",
};

const chipLabel: Record<RecentTrip["level"], string> = {
  safe: "Safe",
  caution: "Caution",
  warning: "Warning",
  danger: "Avoid",
};

type Suggestion = { icon: LucideIcon; text: string };

function suggestActions(t: RecentTrip): Suggestion[] {
  const s: Suggestion[] = [];
  const c = t.condition.toLowerCase();
  if (t.level === "danger") s.push({ icon: Zap, text: "Postpone trip if possible" });
  if (/storm|thunder/.test(c)) s.push({ icon: Zap, text: "Avoid open areas; delay travel" });
  if (/rain|drizzle|shower/.test(c))
    s.push({ icon: Umbrella, text: "Carry rain gear; drive slowly" });
  if (/snow|sleet|blizzard/.test(c))
    s.push({ icon: Snowflake, text: "Use snow tyres; check road closures" });
  if (/fog|mist|haze/.test(c))
    s.push({ icon: Droplets, text: "Use low-beam lights; keep distance" });
  if (t.windKph >= 40) s.push({ icon: Wind, text: "High winds — secure loose items" });
  if (t.tempC >= 35) s.push({ icon: Thermometer, text: "Hydrate; avoid midday travel" });
  if (t.tempC <= 5) s.push({ icon: Thermometer, text: "Layer up; watch for icy roads" });
  if (s.length === 0) s.push({ icon: Sun, text: "Clear to travel — enjoy the ride" });
  if (s.length === 1 && t.level !== "safe")
    s.push({ icon: CloudRain, text: "Check forecast before departure" });
  return s.slice(0, 2);
}

export function TravelAdvisory() {
  const { trips } = useRecentTrips();

  return (
    <GlassCard className="col-span-12 sm:col-span-6 lg:col-span-4">
      <div className="p-5 sm:p-6">
        <div className="mb-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <RouteIcon className="h-4 w-4" aria-hidden="true" />
            <h3 className="font-display text-lg font-semibold">Travel advisory</h3>
          </div>
          <Link
            to="/travel"
            className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            New search <ArrowRight className="h-3 w-3" aria-hidden="true" />
          </Link>
        </div>

        {trips.length === 0 ? (
          <Link
            to="/travel"
            className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-glass-border/60 p-6 text-center text-xs text-muted-foreground transition hover:border-primary/40 hover:bg-accent/10"
          >
            <MapPin className="h-5 w-5" aria-hidden="true" />
            <span>Search a destination in Travel advisory to see it here.</span>
          </Link>
        ) : (
          <ul className="space-y-2">
            {trips.slice(0, 3).map((t) => (
              <li key={t.id}>
                <Link
                  to="/travel"
                  className="block rounded-2xl border border-glass-border/50 bg-glass p-3 transition hover:border-primary/40"
                  aria-label={`${t.from.name} to ${t.to.name}, ${chipLabel[t.level]}`}
                >
                  <div className="flex items-center justify-between gap-2 text-sm">
                    <div className="flex min-w-0 items-center gap-1.5 truncate font-medium">
                      <Car className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      <span className="truncate">{t.from.name}</span>
                      <ArrowRight
                        className="h-3 w-3 shrink-0 text-muted-foreground"
                        aria-hidden="true"
                      />
                      <span className="truncate">{t.to.name}</span>
                    </div>
                    <span
                      className={cn(
                        "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                        chipColor[t.level],
                      )}
                    >
                      {chipLabel[t.level]}
                    </span>
                  </div>
                  <div className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                    {t.headline}
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span className="inline-flex items-center gap-2">
                      <span className="font-medium text-foreground">
                        Dest: {Math.round(t.tempC)}°C · {t.condition}
                      </span>
                      <span className="inline-flex items-center gap-0.5">
                        <Wind className="h-3 w-3" aria-hidden="true" />
                        {Math.round(t.windKph)} km/h
                      </span>
                    </span>
                    <span className="font-semibold tabular-nums text-foreground">
                      {Math.round(t.distanceKm)} km · {timeAgo(t.savedAt)}
                    </span>
                  </div>
                  <ul className="mt-2 space-y-1">
                    {suggestActions(t).map((s, i) => {
                      const Icon = s.icon;
                      return (
                        <li
                          key={i}
                          className="flex items-start gap-1.5 text-[11px] text-foreground/80"
                        >
                          <Icon
                            className="mt-0.5 h-3 w-3 shrink-0 text-primary"
                            aria-hidden="true"
                          />
                          <span>{s.text}</span>
                        </li>
                      );
                    })}
                  </ul>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </GlassCard>
  );
}
