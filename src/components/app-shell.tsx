import { Link, useRouterState } from "@tanstack/react-router";
import { Bell, Bookmark, CloudSun, Map, Menu, MoonStar, Newspaper, Settings, ShieldAlert, Sun, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { useTheme } from "./theme-provider";
import { LocationSwitcher } from "./location-switcher";
import { breakingNews } from "../lib/mock/news";
import { cn } from "../lib/utils";

const NAV = [
  { to: "/", label: "Dashboard", icon: CloudSun },
  { to: "/news", label: "News", icon: Newspaper },
  { to: "/map", label: "Map", icon: Map },
  { to: "/alerts", label: "Alerts", icon: ShieldAlert },
  { to: "/bookmarks", label: "Saved", icon: Bookmark },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { resolved, setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-glass-border/60 bg-background/60 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-3 px-4 sm:px-6">
          <button
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-full hover:bg-accent/30 lg:hidden"
            aria-label="Toggle nav"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <Link to="/" className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg">
              <CloudSun className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="font-display text-lg font-bold tracking-tight">Aurora<span className="text-accent">Guardian</span></div>
          </Link>

          <nav className="ml-6 hidden items-center gap-1 lg:flex">
            {NAV.map(({ to, label, icon: Icon }) => {
              const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
              return (
                <Link
                  key={to}
                  to={to}
                  className={cn(
                    "flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium transition",
                    active
                      ? "bg-primary/15 text-foreground"
                      : "text-muted-foreground hover:bg-accent/20 hover:text-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <LocationSwitcher />
            <button
              onClick={() => setTheme(resolved === "dark" ? "light" : "dark")}
              className="grid h-10 w-10 place-items-center rounded-full border border-glass-border/70 bg-glass transition hover:bg-accent/20"
              aria-label="Toggle theme"
            >
              {resolved === "dark" ? <Sun className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
            </button>
            <button className="relative grid h-10 w-10 place-items-center rounded-full border border-glass-border/70 bg-glass transition hover:bg-accent/20" aria-label="Notifications">
              <Bell className="h-4 w-4" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-weather-critical animate-pulse-alert" />
            </button>
          </div>
        </div>

        {open && (
          <nav className="border-t border-glass-border/60 px-4 pb-3 pt-2 lg:hidden">
            <div className="grid grid-cols-2 gap-1.5">
              {NAV.map(({ to, label, icon: Icon }) => {
                const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
                return (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-2 rounded-2xl px-3 py-2.5 text-sm font-medium",
                      active ? "bg-primary/15" : "hover:bg-accent/20",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </Link>
                );
              })}
            </div>
          </nav>
        )}

        <BreakingTicker />
      </header>

      <main className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:py-8">{children}</main>

      <footer className="mx-auto max-w-[1440px] px-4 py-8 text-center text-xs text-muted-foreground sm:px-6">
        Aurora Guardian · Sample data for demonstration. Always follow official guidance from local authorities during emergencies.
      </footer>
    </div>
  );
}

function BreakingTicker() {
  const items = breakingNews();
  if (!items.length) return null;
  return (
    <div className="overflow-hidden border-t border-glass-border/60 bg-gradient-to-r from-weather-critical/10 via-transparent to-weather-storm/10">
      <div className="mx-auto flex max-w-[1440px] items-center gap-3 px-4 py-2 sm:px-6">
        <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-weather-critical px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white animate-pulse-alert">
          <ShieldAlert className="h-3 w-3" /> Breaking
        </span>
        <div className="relative flex-1 overflow-hidden">
          <div className="flex whitespace-nowrap animate-ticker gap-10">
            {[...items, ...items].map((n, i) => (
              <Link
                key={i}
                to="/news/$slug"
                params={{ slug: n.slug }}
                className="text-sm font-medium hover:underline"
              >
                <span className="mr-2 text-muted-foreground">{n.source.name} ·</span>
                {n.headline}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
