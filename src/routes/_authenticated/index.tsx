import { createFileRoute } from "@tanstack/react-router";
import { HeroWeather } from "../../components/dashboard/hero-weather";
import { AlertBanner } from "../../components/dashboard/alert-banner";
import { HourlyForecast } from "../../components/dashboard/hourly-forecast";
import { SevenDay } from "../../components/dashboard/seven-day";
import { PreparednessScore } from "../../components/dashboard/preparedness-score";
import { Checklist } from "../../components/dashboard/checklist";
import { AIAssistant } from "../../components/dashboard/ai-assistant";
import { TravelAdvisory } from "../../components/dashboard/travel-advisory";
import { NearbyShelters } from "../../components/dashboard/nearby-shelters";
import { IncidentMap } from "../../components/dashboard/incident-map";
import { EmergencyContacts } from "../../components/dashboard/emergency-contacts";
import { Notifications } from "../../components/dashboard/notifications";
import { LatestNewsWidget } from "../../components/dashboard/latest-news-widget";
import { KnowledgeHub } from "../../components/dashboard/knowledge-hub";

export const Route = createFileRoute("/_authenticated/")({
  component: Dashboard,
});

function Dashboard() {
  return (
    <div className="grid grid-cols-12 gap-4 sm:gap-5">
      <AlertBanner />
      <HeroWeather />
      <PreparednessScore />
      <HourlyForecast />
      <AIAssistant />
      <SevenDay />
      <Checklist />
      <LatestNewsWidget />
      <TravelAdvisory />
      <IncidentMap />
      <NearbyShelters />
      <EmergencyContacts />
      <Notifications />
      <KnowledgeHub />
    </div>
  );
}
