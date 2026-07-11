import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { GlassCard } from "../../components/glass-card";
import { useTheme } from "../../components/theme-provider";
import { MapPin, MoonStar, Sun, Monitor, Bell, Home, Languages, LogOut } from "lucide-react";
import { useLocation } from "../../lib/locations";
import { LANGUAGES, setLanguage, type LangCode } from "../../lib/i18n";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Mausam" },
      { name: "description", content: "Manage location, language, theme, and notification preferences." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();
  const { active, homeId, setHome, locations } = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const displayName = [active.label, active.name, active.region].filter(Boolean).join(" · ");
  const isHome = active.id === homeId;
  const currentLang = (i18n.language as LangCode) || "en";

  const signOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{t("settings.title")}</h1>
      </div>

      <GlassCard>
        <div className="p-6">
          <div className="mb-3 flex items-center gap-2"><MapPin className="h-4 w-4" /><h3 className="font-display text-lg font-semibold">{t("settings.location")}</h3></div>
          <div className="rounded-2xl border border-glass-border/60 bg-glass px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold">{displayName}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">
                  {active.country} · {active.lat.toFixed(3)}, {active.lon.toFixed(3)}
                </div>
              </div>
              {isHome ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2.5 py-1 text-[11px] font-medium text-primary">
                  <Home className="h-3 w-3" /> {t("common.home")}
                </span>
              ) : (
                <button
                  onClick={() => setHome(active.id).catch(() => {})}
                  className="rounded-full border border-glass-border/60 px-3 py-1 text-[11px] font-medium hover:bg-accent/20"
                >
                  {t("common.setAsHome")}
                </button>
              )}
            </div>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {t("settings.mirrorNote")}{" "}
            <Link to="/" className="text-primary hover:underline">{t("common.change")}</Link>
            {locations.length > 1 ? ` (${locations.length}).` : "."}
          </p>
        </div>
      </GlassCard>

      <GlassCard>
        <div className="p-6">
          <div className="mb-3 flex items-center gap-2"><Languages className="h-4 w-4" /><h3 className="font-display text-lg font-semibold">{t("settings.language")}</h3></div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {LANGUAGES.map((l) => {
              const active = currentLang === l.code;
              return (
                <button
                  key={l.code}
                  onClick={() => setLanguage(l.code)}
                  className={
                    "flex flex-col items-start gap-0.5 rounded-2xl border p-3 text-left transition " +
                    (active ? "border-primary bg-primary/10" : "border-glass-border/60 bg-glass hover:bg-accent/20")
                  }
                  aria-pressed={active}
                >
                  <span className="text-sm font-semibold" dir={l.dir}>{l.native}</span>
                  <span className="text-[11px] text-muted-foreground">{l.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </GlassCard>

      <GlassCard>
        <div className="p-6">
          <div className="mb-3 flex items-center gap-2"><MoonStar className="h-4 w-4" /><h3 className="font-display text-lg font-semibold">{t("settings.theme")}</h3></div>
          <div className="grid grid-cols-3 gap-2">
            {([
              { v: "light" as const, Icon: Sun, key: "light" as const },
              { v: "dark" as const, Icon: MoonStar, key: "dark" as const },
              { v: "system" as const, Icon: Monitor, key: "system" as const },
            ]).map(({ v, Icon, key }) => (
              <button key={v} onClick={() => setTheme(v)} className={"flex flex-col items-center gap-2 rounded-2xl border p-4 " + (theme === v ? "border-primary bg-primary/10" : "border-glass-border/60 bg-glass hover:bg-accent/20")}>
                <Icon className="h-5 w-5" />
                <span className="text-sm font-medium">{t(`theme.${key}`)}</span>
              </button>
            ))}
          </div>
        </div>
      </GlassCard>

      <GlassCard>
        <div className="p-6">
          <div className="mb-3 flex items-center gap-2"><Bell className="h-4 w-4" /><h3 className="font-display text-lg font-semibold">{t("settings.notifications")}</h3></div>
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
