import { useMemo } from "react";
import { GlassCard } from "../glass-card";
import { WeatherIcon } from "../weather-icons/weather-icon";
import { hourlyFor } from "../../lib/mock/weather";
import { formatHour } from "../../lib/format-time";
import { useLocation } from "../../lib/locations";

export function HourlyForecast() {
  const { active, refreshTick } = useLocation();
  const hourly = useMemo(() => hourlyFor(active), [active, refreshTick]);
  const max = Math.max(...hourly.map((h) => h.tempF));
  const min = Math.min(...hourly.map((h) => h.tempF));
  return (
    <GlassCard className="col-span-12 lg:col-span-8">
      <div className="p-5 sm:p-6">
        <div className="mb-4 flex items-baseline justify-between">
          <h3 className="font-display text-lg font-semibold">Next 24 hours</h3>
          <span className="text-xs text-muted-foreground">Hourly</span>
        </div>
        <div className="-mx-2 overflow-x-auto pb-1">
          <div className="flex min-w-max gap-2 px-2">
            {hourly.map((h, i) => {
              const t = (h.tempF - min) / Math.max(1, max - min);
              return (
                <div
                  key={i}
                  className="flex w-16 flex-col items-center gap-2 rounded-2xl border border-glass-border/50 bg-glass py-3"
                >
                  <div className="text-[11px] font-medium text-muted-foreground">
                    {i === 0 ? "Now" : formatHour(h.time)}
                  </div>
                  <div className="h-8 w-8">
                    <WeatherIcon condition={h.condition} animated={false} />
                  </div>
                  <div className="text-sm font-semibold tabular-nums">{h.tempF}°</div>
                  <div className="h-1.5 w-10 overflow-hidden rounded-full bg-weather-rain/15">
                    <div
                      className="h-full rounded-full bg-weather-rain"
                      style={{ width: `${h.precip}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-muted-foreground tabular-nums">{h.precip}%</div>
                  <div
                    className="mt-1 h-1 w-8 rounded-full"
                    style={{
                      background: `linear-gradient(90deg, var(--color-weather-rain), var(--color-weather-sunny))`,
                      opacity: 0.4 + t * 0.6,
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
