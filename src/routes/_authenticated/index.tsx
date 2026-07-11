import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { HeroWeather } from "../../components/dashboard/hero-weather";
import { AlertBanner } from "../../components/dashboard/alert-banner";
import { HourlyForecast } from "../../components/dashboard/hourly-forecast";
import { PreparednessScore } from "../../components/dashboard/preparedness-score";
import { Checklist } from "../../components/dashboard/checklist";
import { LatestNewsWidget } from "../../components/dashboard/latest-news-widget";

// Below-the-fold widgets: lazy-loaded to shrink initial dashboard chunk.
const AIAssistant       = lazy(() => import("../../components/dashboard/ai-assistant").then((m) => ({ default: m.AIAssistant })));
const TravelAdvisory    = lazy(() => import("../../components/dashboard/travel-advisory").then((m) => ({ default: m.TravelAdvisory })));
const NearbyShelters    = lazy(() => import("../../components/dashboard/nearby-shelters").then((m) => ({ default: m.NearbyShelters })));
const EmergencyContacts = lazy(() => import("../../components/dashboard/emergency-contacts").then((m) => ({ default: m.EmergencyContacts })));
const Notifications     = lazy(() => import("../../components/dashboard/notifications").then((m) => ({ default: m.Notifications })));
const KnowledgeHub      = lazy(() => import("../../components/dashboard/knowledge-hub").then((m) => ({ default: m.KnowledgeHub })));
const SevenDay          = lazy(() => import("../../components/dashboard/seven-day").then((m) => ({ default: m.SevenDay })));

export const Route = createFileRoute("/_authenticated/")({
  component: Dashboard,
});

function WidgetFallback() {
  return <div className="col-span-12 h-40 animate-pulse rounded-3xl bg-glass" aria-hidden="true" />;
}

function Dashboard() {
  return (
    <div className="grid grid-cols-12 gap-4 sm:gap-5">
      <AlertBanner />
      <HeroWeather />
      <LatestNewsWidget />
      <PreparednessScore />
      <HourlyForecast />
      <Suspense fallback={<WidgetFallback />}><AIAssistant /></Suspense>
      <Checklist />
      <Suspense fallback={<WidgetFallback />}><TravelAdvisory /></Suspense>
      <Suspense fallback={<WidgetFallback />}><NearbyShelters /></Suspense>
      <Suspense fallback={<WidgetFallback />}><EmergencyContacts /></Suspense>
      <Suspense fallback={<WidgetFallback />}><Notifications /></Suspense>
      <Suspense fallback={<WidgetFallback />}><KnowledgeHub /></Suspense>
      <Suspense fallback={<WidgetFallback />}><SevenDay /></Suspense>
    </div>
  );
}
