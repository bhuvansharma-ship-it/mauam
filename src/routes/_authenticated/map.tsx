import { createFileRoute } from "@tanstack/react-router";
import { IncidentMap } from "../components/dashboard/incident-map";
import { NearbyShelters } from "../components/dashboard/nearby-shelters";

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "Live Incident Map — Aurora Guardian" },
      { name: "description", content: "Live map of incidents, shelters, evacuation routes, and safe zones near you." },
      { property: "og:title", content: "Live Incident Map — Aurora Guardian" },
    ],
  }),
  component: MapPage,
});

function MapPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Live incident map</h1>
        <p className="mt-1 text-sm text-muted-foreground">Real-time overlay of weather, incidents, shelters, and evacuation routes.</p>
      </div>
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 lg:col-span-8"><IncidentMap /></div>
        <div className="col-span-12 lg:col-span-4"><NearbyShelters /></div>
      </div>
    </div>
  );
}
