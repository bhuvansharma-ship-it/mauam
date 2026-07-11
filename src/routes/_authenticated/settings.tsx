import { createFileRoute } from "@tanstack/react-router";
import { GlassCard } from "../components/glass-card";
import { useTheme } from "../components/theme-provider";
import { MapPin, MoonStar, Sun, Monitor, Bell } from "lucide-react";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Aurora Guardian" },
      { name: "description", content: "Manage location, theme, and notification preferences." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { theme, setTheme } = useTheme();
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Settings</h1>
      </div>

      <GlassCard>
        <div className="p-6">
          <div className="mb-3 flex items-center gap-2"><MapPin className="h-4 w-4" /><h3 className="font-display text-lg font-semibold">Location</h3></div>
          <input defaultValue="San Francisco, CA" className="w-full rounded-2xl border border-glass-border/60 bg-glass px-4 py-2.5 text-sm outline-none" />
        </div>
      </GlassCard>

      <GlassCard>
        <div className="p-6">
          <div className="mb-3 flex items-center gap-2"><MoonStar className="h-4 w-4" /><h3 className="font-display text-lg font-semibold">Theme</h3></div>
          <div className="grid grid-cols-3 gap-2">
            {([
              { v: "light" as const, Icon: Sun, label: "Light" },
              { v: "dark" as const, Icon: MoonStar, label: "Dark" },
              { v: "system" as const, Icon: Monitor, label: "System" },
            ]).map(({ v, Icon, label }) => (
              <button key={v} onClick={() => setTheme(v)} className={"flex flex-col items-center gap-2 rounded-2xl border p-4 " + (theme === v ? "border-primary bg-primary/10" : "border-glass-border/60 bg-glass hover:bg-accent/20")}>
                <Icon className="h-5 w-5" />
                <span className="text-sm font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </GlassCard>

      <GlassCard>
        <div className="p-6">
          <div className="mb-3 flex items-center gap-2"><Bell className="h-4 w-4" /><h3 className="font-display text-lg font-semibold">Notifications</h3></div>
          <div className="space-y-2">
            {["Critical weather alerts", "Government advisories", "Breaking news", "Preparedness reminders"].map((label, i) => (
              <label key={label} className="flex items-center justify-between rounded-2xl border border-glass-border/60 bg-glass px-4 py-3">
                <span className="text-sm">{label}</span>
                <input type="checkbox" defaultChecked={i < 2} className="h-4 w-4 accent-primary" />
              </label>
            ))}
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
