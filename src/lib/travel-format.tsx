import type { ReactNode } from "react";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import type { TravelAdvisory } from "./travel.functions";

export type AdvisoryStyle = {
  badge: string;
  ring: string;
  icon: ReactNode;
  label: string;
};

export const ADVISORY_STYLE: Record<TravelAdvisory["level"], AdvisoryStyle> = {
  safe: {
    badge: "bg-emerald-500/20 text-emerald-500",
    ring: "border-emerald-500/40",
    icon: <ShieldCheck className="h-5 w-5" aria-hidden="true" />,
    label: "Safe to travel",
  },
  caution: {
    badge: "bg-sky-500/20 text-sky-500",
    ring: "border-sky-500/40",
    icon: <ShieldCheck className="h-5 w-5" aria-hidden="true" />,
    label: "Minor caution",
  },
  warning: {
    badge: "bg-weather-warning/20 text-weather-warning",
    ring: "border-weather-warning/50",
    icon: <ShieldAlert className="h-5 w-5" aria-hidden="true" />,
    label: "Travel warning",
  },
  danger: {
    badge: "bg-weather-critical/20 text-weather-critical",
    ring: "border-weather-critical/60",
    icon: <ShieldAlert className="h-5 w-5 animate-pulse-alert" aria-hidden="true" />,
    label: "Do not travel",
  },
};

export function fmtTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export function fmtDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });
}
