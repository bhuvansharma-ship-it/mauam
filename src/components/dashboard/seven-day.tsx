import { GlassCard } from "../glass-card";
import { WeatherIcon } from "../weather-icons/weather-icon";
import { sevenDay } from "../../lib/mock/weather";
import { formatDay } from "../../lib/format-time";

export function SevenDay() {
  const globalMin = Math.min(...sevenDay.map((d) => d.low));
  const globalMax = Math.max(...sevenDay.map((d) => d.high));
  const range = globalMax - globalMin;
  return (
    <GlassCard className="col-span-12 lg:col-span-8">
      <div className="p-5 sm:p-6">
        <div className="mb-4 flex items-baseline justify-between">
          <h3 className="font-display text-lg font-semibold">7-day forecast</h3>
          <span className="text-xs text-muted-foreground">San Francisco</span>
        </div>
        <div className="space-y-1">
          {sevenDay.map((d, i) => {
            const left = ((d.low - globalMin) / range) * 100;
            const right = ((d.high - globalMin) / range) * 100;
            return (
              <div key={i} className="grid grid-cols-[64px_36px_1fr_88px] items-center gap-3 rounded-xl px-2 py-2 hover:bg-accent/10">
                <div className="text-sm font-medium">{i === 0 ? "Today" : formatDay(d.date)}</div>
                <div className="h-7 w-7"><WeatherIcon condition={d.condition} animated={false} /></div>
                <div className="relative h-2 rounded-full bg-muted/60">
                  <div
                    className="absolute top-0 h-2 rounded-full"
                    style={{
                      left: `${left}%`,
                      width: `${right - left}%`,
                      background: "linear-gradient(90deg, var(--color-weather-rain), var(--color-weather-sunny))",
                    }}
                  />
                </div>
                <div className="flex justify-end gap-2 text-sm tabular-nums">
                  <span className="text-muted-foreground">{d.low}°</span>
                  <span className="font-semibold">{d.high}°</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </GlassCard>
  );
}
