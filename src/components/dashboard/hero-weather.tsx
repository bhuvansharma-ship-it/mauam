import { Droplets, Eye, RefreshCw, Sunrise, Sunset, Wind } from "lucide-react";
import { GlassCard } from "../glass-card";
import { WeatherIcon } from "../weather-icons/weather-icon";
import { weatherFor } from "../../lib/mock/weather";
import { useLocation } from "../../lib/locations";
import { useMemo } from "react";

export function HeroWeather() {
  const { active, refreshTick, refresh } = useLocation();
  const w = useMemo(() => weatherFor(active), [active, refreshTick]);
  return (
    <GlassCard className="mausam-bg col-span-12 lg:col-span-8 xl:col-span-8" glow="primary">
      <div className="relative flex flex-col gap-6 p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
              <span>Now in</span>
              {active.label && (
                <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] tracking-wider text-primary">
                  {active.label}
                </span>
              )}
              <button
                onClick={refresh}
                className="ml-1 grid h-6 w-6 place-items-center rounded-full hover:bg-accent/30"
                aria-label="Refresh"
                title="Refresh"
              >
                <RefreshCw className="h-3 w-3" />
              </button>
            </div>
            <div className="font-display text-2xl font-semibold sm:text-3xl">{w.location}</div>
            <div className="text-sm text-muted-foreground">{w.region}</div>
          </div>
          <div className="h-24 w-24 sm:h-32 sm:w-32 shrink-0">
            <WeatherIcon condition={w.condition} />
          </div>
        </div>

        <div className="flex items-end gap-4">
          <div className="font-display text-7xl font-bold tabular-nums leading-none sm:text-8xl">{w.tempF}°C</div>
          <div className="pb-2">
            <div className="text-base font-medium">{w.conditionLabel}</div>
            <div className="text-sm text-muted-foreground">Feels like {w.feelsLikeF}°C · H {w.high}°C · L {w.low}°C</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Metric icon={<Droplets className="h-4 w-4" />} label="Humidity" value={`${w.humidity}%`} />
          <Metric icon={<Wind className="h-4 w-4" />} label="Wind" value={`${w.windMph} km/h ${w.windDir}`} />

          <Metric icon={<Eye className="h-4 w-4" />} label="UV Index" value={`${w.uv}`} />
          <Metric icon={<Sunrise className="h-4 w-4" />} label="Sunrise" value={w.sunrise} extra={<><Sunset className="h-3 w-3" />{w.sunset}</>} />
        </div>
      </div>
    </GlassCard>
  );
}

function Metric({ icon, label, value, extra }: { icon: React.ReactNode; label: string; value: string; extra?: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-glass-border/60 bg-glass p-3">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">{icon} {label}</div>
      <div className="mt-1 font-display text-lg font-semibold tabular-nums">{value}</div>
      {extra && <div className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">{extra}</div>}
    </div>
  );
}
