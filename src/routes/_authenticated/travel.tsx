import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeftRight, ArrowRight, Loader2, MapPin, Navigation } from "lucide-react";
import { GlassCard } from "../../components/glass-card";
import { useLocation } from "../../lib/locations";
import { fetchTravelAdvisory } from "../../lib/travel.functions";
import { cn } from "../../lib/utils";
import { CityPicker, type Point } from "../../components/travel/city-picker";
import {
  AdvisorySummary,
  DestinationWeather,
  DailyOutlook,
} from "../../components/travel/advisory-panels";
import { useRecentTrips } from "../../hooks/use-recent-trips";

export const Route = createFileRoute("/_authenticated/travel")({
  head: () => ({
    meta: [
      { title: "Travel Advisory — Mausam" },
      {
        name: "description",
        content:
          "Pick your origin and destination and get a real-time, weather-based travel advisory.",
      },
      { property: "og:title", content: "Travel Advisory — Mausam" },
    ],
  }),
  component: TravelPage,
});

function TravelPage() {
  const { active } = useLocation();
  const [from, setFrom] = useState<Point | null>(() => ({
    name: active.name,
    region: active.region,
    country: active.country,
    lat: active.lat,
    lon: active.lon,
  }));
  const [to, setTo] = useState<Point | null>(null);

  const advisorFn = useServerFn(fetchTravelAdvisory);
  const { add: addRecentTrip } = useRecentTrips();
  const mut = useMutation({
    mutationFn: (v: { from: Point; to: Point }) => advisorFn({ data: v }),
    onSuccess: (data) => addRecentTrip(data),
  });

  const canCheck = from && to && !(from.lat === to.lat && from.lon === to.lon);
  const swap = () => {
    const f = from;
    setFrom(to);
    setTo(f);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Travel advisory
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Pick where you're going. We'll check the weather at your destination and tell you if it's
          safe to travel.
        </p>
      </div>

      <GlassCard className="p-4 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <CityPicker
            label="From"
            icon={<Navigation className="h-3.5 w-3.5" aria-hidden="true" />}
            value={from}
            onChange={setFrom}
            placeholder="Origin city"
          />
          <button
            type="button"
            onClick={swap}
            aria-label="Swap origin and destination"
            className="mx-auto grid h-11 w-11 shrink-0 place-items-center self-end rounded-full border border-border/60 hover:bg-accent sm:mx-0 sm:mb-1"
          >
            <ArrowLeftRight className="h-4 w-4" aria-hidden="true" />
          </button>
          <CityPicker
            label="To"
            icon={<MapPin className="h-3.5 w-3.5" aria-hidden="true" />}
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
              "inline-flex min-h-11 items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition",
              (!canCheck || mut.isPending) && "cursor-not-allowed opacity-50",
            )}
          >
            {mut.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            )}
            Check advisory
          </button>
        </div>
      </GlassCard>

      {mut.isError && (
        <GlassCard className="border-weather-critical/40 p-4 text-sm text-weather-critical">
          <div role="alert">Couldn't fetch weather for that destination. Please try again.</div>
        </GlassCard>
      )}

      {mut.data && (
        <>
          <AdvisorySummary advisory={mut.data} />
          <DestinationWeather advisory={mut.data} />
          <DailyOutlook advisory={mut.data} />
        </>
      )}
    </div>
  );
}
