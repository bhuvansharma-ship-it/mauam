import { AlertTriangle, Flame, Waves, Zap } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { GlassCard } from "../glass-card";
import { incidents } from "../../lib/mock/emergency";

const iconFor = { flood: Waves, fire: Flame, accident: AlertTriangle, outage: Zap };
const colorFor = { flood: "text-weather-flood bg-weather-flood/15", fire: "text-weather-critical bg-weather-critical/15", accident: "text-weather-warning bg-weather-warning/15", outage: "text-weather-storm bg-weather-storm/15" };

export function IncidentMap() {
  return (
    <GlassCard className="col-span-12 lg:col-span-8" glow="warning">
      <div className="p-5 sm:p-6">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold">Incident map</h3>
          <Link to="/map" className="text-xs font-medium text-primary hover:underline">Open full map →</Link>
        </div>
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-glass-border/60">
          <svg viewBox="0 0 100 56" className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
            <defs>
              <linearGradient id="map-bg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="oklch(0.42 0.06 260)" />
                <stop offset="100%" stopColor="oklch(0.28 0.06 280)" />
              </linearGradient>
            </defs>
            <rect width="100" height="56" fill="url(#map-bg)" />
            {/* fake water */}
            <path d="M0 40 Q30 30 60 42 T100 38 L100 56 L0 56 Z" fill="oklch(0.3 0.08 240)" opacity="0.8" />
            {/* fake roads */}
            {Array.from({ length: 6 }).map((_, i) => (
              <line key={i} x1="0" y1={8 + i * 8} x2="100" y2={4 + i * 8} stroke="oklch(0.55 0.02 260)" strokeWidth="0.25" opacity="0.5" />
            ))}
            {Array.from({ length: 6 }).map((_, i) => (
              <line key={i} x1={10 + i * 16} y1="0" x2={14 + i * 16} y2="56" stroke="oklch(0.55 0.02 260)" strokeWidth="0.25" opacity="0.5" />
            ))}
          </svg>
          {incidents.map((inc) => {
            const Icon = iconFor[inc.kind];
            return (
              <div key={inc.id} className="group absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${inc.x}%`, top: `${inc.y}%` }}>
                <div className={`grid h-9 w-9 place-items-center rounded-full border border-white/20 shadow-lg animate-pulse-alert ${colorFor[inc.kind]}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-background/90 px-2 py-1 text-[11px] font-medium opacity-0 shadow-lg backdrop-blur transition group-hover:opacity-100">
                  {inc.label}
                </div>
              </div>
            );
          })}
          <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5 rounded-xl bg-background/70 p-2 text-[10px] backdrop-blur">
            {(["flood", "fire", "accident", "outage"] as const).map((k) => {
              const Icon = iconFor[k];
              return <span key={k} className={`flex items-center gap-1 rounded-full px-1.5 py-0.5 ${colorFor[k]}`}><Icon className="h-3 w-3" />{k}</span>;
            })}
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
