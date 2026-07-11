import type { ReactNode } from "react";
import { ArrowRight, CloudRain, Sunrise, Thermometer, Wind } from "lucide-react";
import { GlassCard } from "../glass-card";
import { cn } from "../../lib/utils";
import { ADVISORY_STYLE, fmtDate, fmtTime } from "../../lib/travel-format";
import type { TravelAdvisory } from "../../lib/travel.functions";

function Stat({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border/60 p-3">
      <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="mt-1 font-display text-base font-semibold">{value}</div>
    </div>
  );
}

export function AdvisorySummary({ advisory }: { advisory: TravelAdvisory }) {
  const style = ADVISORY_STYLE[advisory.level];
  return (
    <GlassCard className={cn("border p-5 sm:p-6", style.ring)}>
      <div className="flex flex-wrap items-start gap-4">
        <div className={cn("grid h-12 w-12 shrink-0 place-items-center rounded-2xl", style.badge)}>
          {style.icon}
        </div>
        <div className="min-w-0 flex-1">
          <div
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
              style.badge,
            )}
          >
            {style.label}
          </div>
          <h2 className="mt-2 font-display text-xl font-semibold sm:text-2xl">
            {advisory.headline}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {advisory.from.name} <ArrowRight className="inline h-3.5 w-3.5" aria-label="to" />{" "}
            {advisory.to.name} · ~{advisory.distanceKm} km
          </p>
        </div>
      </div>

      {advisory.reasons.length > 0 && (
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <div className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Why
            </div>
            <ul className="space-y-1 text-sm">
              {advisory.reasons.map((r, i) => (
                <li key={i} className="flex gap-2">
                  <span
                    className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-current opacity-60"
                    aria-hidden="true"
                  />
                  {r}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              What to do
            </div>
            <ul className="space-y-1 text-sm">
              {advisory.tips.map((t, i) => (
                <li key={i} className="flex gap-2">
                  <span
                    className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-current opacity-60"
                    aria-hidden="true"
                  />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </GlassCard>
  );
}

export function DestinationWeather({ advisory }: { advisory: TravelAdvisory }) {
  return (
    <GlassCard className="p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Destination weather
          </div>
          <h3 className="font-display text-lg font-semibold">{advisory.to.name}</h3>
        </div>
        <div className="text-right">
          <div className="font-display text-3xl font-bold">{advisory.destination.tempC}°C</div>
          <div className="text-xs text-muted-foreground">{advisory.destination.condition}</div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat
          icon={<Thermometer className="h-4 w-4" aria-hidden="true" />}
          label="High / Low"
          value={`${advisory.destination.tempMaxC}° / ${advisory.destination.tempMinC}°`}
        />
        <Stat
          icon={<CloudRain className="h-4 w-4" aria-hidden="true" />}
          label="Rain (24h)"
          value={`${advisory.destination.precipMm.toFixed(1)} mm`}
        />
        <Stat
          icon={<Wind className="h-4 w-4" aria-hidden="true" />}
          label="Wind / Gust"
          value={`${advisory.destination.windKph} / ${advisory.destination.windGustKph} km/h`}
        />
        <Stat
          icon={<Sunrise className="h-4 w-4" aria-hidden="true" />}
          label="Sunrise"
          value={fmtTime(advisory.destination.sunrise)}
        />
      </div>
    </GlassCard>
  );
}

export function DailyOutlook({ advisory }: { advisory: TravelAdvisory }) {
  return (
    <GlassCard className="p-5 sm:p-6">
      <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        5-day outlook at destination
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {advisory.daily.slice(0, 5).map((d) => (
          <div key={d.date} className="rounded-2xl border border-border/60 p-3">
            <div className="text-xs font-semibold">{fmtDate(d.date)}</div>
            <div className="mt-1 text-xs text-muted-foreground">{d.condition}</div>
            <div className="mt-2 font-display text-lg font-semibold">
              {d.tempMaxC}° / {d.tempMinC}°
            </div>
            <div className="mt-1 flex items-center gap-3 text-[11px] text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <CloudRain className="h-3 w-3" aria-hidden="true" />
                {d.precipMm.toFixed(0)}mm
              </span>
              <span className="inline-flex items-center gap-1">
                <Wind className="h-3 w-3" aria-hidden="true" />
                {d.windKph}
              </span>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
