import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ArrowRight, Loader2, MapPin, Navigation, Search, ShieldAlert, ShieldCheck, CloudRain, Wind, Thermometer, Sunrise, Sunset, ArrowLeftRight } from "lucide-react";
import { GlassCard } from "../../components/glass-card";
import { searchCities, useLocation, type GeoSuggestion } from "../../lib/locations";
import { fetchTravelAdvisory, type TravelAdvisory } from "../../lib/travel.functions";
import { cn } from "../../lib/utils";

export const Route = createFileRoute("/_authenticated/travel")({
  head: () => ({
    meta: [
      { title: "Travel Advisory — Aurora Guardian" },
      { name: "description", content: "Pick your origin and destination and get a real-time, weather-based travel advisory." },
      { property: "og:title", content: "Travel Advisory — Aurora Guardian" },
    ],
  }),
  component: TravelPage,
});

type Point = { name: string; region: string; country: string; lat: number; lon: number };

function CityPicker({
  label,
  icon,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  icon: React.ReactNode;
  value: Point | null;
  onChange: (p: Point) => void;
  placeholder: string;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState<GeoSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) { setResults([]); return; }
    const ctrl = new AbortController();
    setLoading(true);
    const t = window.setTimeout(async () => {
      try { setResults(await searchCities(q, ctrl.signal)); }
      catch { setResults([]); }
      finally { setLoading(false); }
    }, 250);
    return () => { ctrl.abort(); window.clearTimeout(t); };
  }, [query]);

  return (
    <div ref={boxRef} className="relative flex-1">
      <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {icon} {label}
      </label>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-2 rounded-2xl border border-border/60 bg-background/40 px-4 py-3 text-left text-sm hover:border-border"
      >
        <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
        {value ? (
          <span className="min-w-0 flex-1 truncate">
            <span className="font-medium">{value.name}</span>
            {value.region && <span className="text-muted-foreground">, {value.region}</span>}
          </span>
        ) : (
          <span className="flex-1 text-muted-foreground">{placeholder}</span>
        )}
      </button>
      {open && (
        <div className="absolute inset-x-0 top-full z-30 mt-2 overflow-hidden rounded-2xl border border-border bg-popover shadow-xl">
          <div className="flex items-center gap-2 border-b border-border/60 px-3 py-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search city…"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            {loading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
          </div>
          <div className="max-h-64 overflow-y-auto">
            {results.length === 0 && query.trim().length >= 2 && !loading ? (
              <div className="p-3 text-xs text-muted-foreground">No matches.</div>
            ) : results.length === 0 ? (
              <div className="p-3 text-xs text-muted-foreground">Type a city name to search.</div>
            ) : (
              results.map((r) => (
                <button
                  key={`${r.name}-${r.lat}-${r.lon}`}
                  onClick={() => { onChange(r); setOpen(false); setQuery(""); }}
                  className="flex w-full items-center gap-2 border-b border-border/40 px-3 py-2 text-left text-sm last:border-b-0 hover:bg-accent"
                >
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="min-w-0 flex-1 truncate">
                    <span className="font-medium">{r.name}</span>
                    <span className="text-muted-foreground">, {r.region}</span>
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const LEVEL_STYLE: Record<TravelAdvisory["level"], { badge: string; ring: string; icon: React.ReactNode; label: string }> = {
  safe:    { badge: "bg-emerald-500/20 text-emerald-500", ring: "border-emerald-500/40", icon: <ShieldCheck className="h-5 w-5" />, label: "Safe to travel" },
  caution: { badge: "bg-sky-500/20 text-sky-500",         ring: "border-sky-500/40",     icon: <ShieldCheck className="h-5 w-5" />, label: "Minor caution" },
  warning: { badge: "bg-weather-warning/20 text-weather-warning",   ring: "border-weather-warning/50",  icon: <ShieldAlert className="h-5 w-5" />, label: "Travel warning" },
  danger:  { badge: "bg-weather-critical/20 text-weather-critical", ring: "border-weather-critical/60", icon: <ShieldAlert className="h-5 w-5 animate-pulse-alert" />, label: "Do not travel" },
};

function TravelPage() {
  const { active } = useLocation();
  const [from, setFrom] = useState<Point | null>(() => ({
    name: active.name, region: active.region, country: active.country, lat: active.lat, lon: active.lon,
  }));
  const [to, setTo] = useState<Point | null>(null);

  const advisorFn = useServerFn(fetchTravelAdvisory);
  const mut = useMutation({
    mutationFn: (v: { from: Point; to: Point }) => advisorFn({ data: v }),
  });

  const canCheck = from && to && !(from.lat === to.lat && from.lon === to.lon);

  const swap = () => { const f = from; setFrom(to); setTo(f); };

  const style = mut.data ? LEVEL_STYLE[mut.data.level] : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Travel advisory</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Pick where you're going. We'll check the weather at your destination and tell you if it's safe to travel.
        </p>
      </div>

      <GlassCard className="p-4 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <CityPicker
            label="From"
            icon={<Navigation className="h-3.5 w-3.5" />}
            value={from}
            onChange={setFrom}
            placeholder="Origin city"
          />
          <button
            type="button"
            onClick={swap}
            aria-label="Swap"
            className="mx-auto grid h-10 w-10 shrink-0 place-items-center self-end rounded-full border border-border/60 hover:bg-accent sm:mx-0 sm:mb-1"
          >
            <ArrowLeftRight className="h-4 w-4" />
          </button>
          <CityPicker
            label="To"
            icon={<MapPin className="h-3.5 w-3.5" />}
            value={to}
            onChange={setTo}
            placeholder="Destination city"
          />
        </div>
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            disabled={!canCheck || mut.isPending}
            onClick={() => from && to && mut.mutate({ from, to })}
            className={cn(
              "inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition",
              (!canCheck || mut.isPending) && "cursor-not-allowed opacity-50"
            )}
          >
            {mut.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
            Check advisory
          </button>
        </div>
      </GlassCard>

      {mut.isError && (
        <GlassCard className="border-weather-critical/40 p-4 text-sm text-weather-critical">
          Couldn't fetch weather for that destination. Please try again.
        </GlassCard>
      )}

      {mut.data && style && (
        <>
          <GlassCard className={cn("border p-5 sm:p-6", style.ring)}>
            <div className="flex flex-wrap items-start gap-4">
              <div className={cn("grid h-12 w-12 shrink-0 place-items-center rounded-2xl", style.badge)}>
                {style.icon}
              </div>
              <div className="min-w-0 flex-1">
                <div className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider", style.badge)}>
                  {style.label}
                </div>
                <h2 className="mt-2 font-display text-xl font-semibold sm:text-2xl">{mut.data.headline}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {mut.data.from.name} <ArrowRight className="inline h-3.5 w-3.5" /> {mut.data.to.name} · ~{mut.data.distanceKm} km
                </p>
              </div>
            </div>

            {mut.data.reasons.length > 0 && (
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <div className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Why</div>
                  <ul className="space-y-1 text-sm">
                    {mut.data.reasons.map((r, i) => (
                      <li key={i} className="flex gap-2"><span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-current opacity-60" />{r}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">What to do</div>
                  <ul className="space-y-1 text-sm">
                    {mut.data.tips.map((t, i) => (
                      <li key={i} className="flex gap-2"><span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-current opacity-60" />{t}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </GlassCard>

          <GlassCard className="p-5 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Destination weather</div>
                <h3 className="font-display text-lg font-semibold">{mut.data.to.name}</h3>
              </div>
              <div className="text-right">
                <div className="font-display text-3xl font-bold">{mut.data.destination.tempC}°C</div>
                <div className="text-xs text-muted-foreground">{mut.data.destination.condition}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Stat icon={<Thermometer className="h-4 w-4" />} label="High / Low" value={`${mut.data.destination.tempMaxC}° / ${mut.data.destination.tempMinC}°`} />
              <Stat icon={<CloudRain className="h-4 w-4" />} label="Rain (24h)" value={`${mut.data.destination.precipMm.toFixed(1)} mm`} />
              <Stat icon={<Wind className="h-4 w-4" />} label="Wind / Gust" value={`${mut.data.destination.windKph} / ${mut.data.destination.windGustKph} km/h`} />
              <Stat icon={<Sunrise className="h-4 w-4" />} label="Sunrise" value={fmtTime(mut.data.destination.sunrise)} />
            </div>
          </GlassCard>

          <GlassCard className="p-5 sm:p-6">
            <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">5-day outlook at destination</div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
              {mut.data.daily.slice(0, 5).map((d) => (
                <div key={d.date} className="rounded-2xl border border-border/60 p-3">
                  <div className="text-xs font-semibold">{fmtDate(d.date)}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{d.condition}</div>
                  <div className="mt-2 font-display text-lg font-semibold">{d.tempMaxC}° / {d.tempMinC}°</div>
                  <div className="mt-1 flex items-center gap-3 text-[11px] text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><CloudRain className="h-3 w-3" />{d.precipMm.toFixed(0)}mm</span>
                    <span className="inline-flex items-center gap-1"><Wind className="h-3 w-3" />{d.windKph}</span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </>
      )}
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border/60 p-3">
      <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{icon}{label}</div>
      <div className="mt-1 font-display text-base font-semibold">{value}</div>
    </div>
  );
}

function fmtTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}
function fmtDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });
}

// suppress unused import warning
void Sunset;
