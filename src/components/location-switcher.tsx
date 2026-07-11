import { useEffect, useMemo, useRef, useState } from "react";
import {
  Bell,
  BellOff,
  Check,
  Home,
  Loader2,
  MapPin,
  Navigation,
  Pencil,
  Plus,
  Search,
  Star,
  Trash2,
  X,
} from "lucide-react";
import { searchCities, useLocation, type GeoSuggestion, type SavedLocation } from "../lib/locations";
import { weatherFor } from "../lib/mock/weather";
import { cn } from "../lib/utils";

export function LocationSwitcher() {
  const {
    locations,
    activeId,
    active,
    homeId,
    setActive,
    addLocation,
    removeLocation,
    renameLocation,
    setHome,
    toggleNotifications,
    detectCurrent,
    detecting,
    detectError,
  } = useLocation();

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<GeoSuggestion[]>([]);
  const [searching, setSearching] = useState(false);
  const [renameId, setRenameId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const popRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (popRef.current && !popRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const q = query.trim();
    if (q.length < 2) {
      setSuggestions([]);
      return;
    }
    const ctrl = new AbortController();
    setSearching(true);
    const t = window.setTimeout(async () => {
      try {
        const r = await searchCities(q, ctrl.signal);
        setSuggestions(r);
      } catch {
        setSuggestions([]);
      } finally {
        setSearching(false);
      }
    }, 250);
    return () => {
      ctrl.abort();
      window.clearTimeout(t);
    };
  }, [query, open]);

  const activeWeather = useMemo(() => weatherFor(active), [active]);

  const pickSuggestion = (s: GeoSuggestion) => {
    void addLocation({ name: s.name, region: s.region, country: s.country, lat: s.lat, lon: s.lon });
    setQuery("");
    setSuggestions([]);
    setOpen(false);
  };

  return (
    <div className="relative" ref={popRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 items-center gap-2 rounded-full border border-glass-border/70 bg-glass px-3 pr-3.5 text-sm transition hover:bg-accent/20"
        aria-expanded={open}
        aria-label="Change location"
      >
        <MapPin className="h-4 w-4 text-primary" />
        <span className="hidden sm:block max-w-[160px] truncate font-medium">{active.name}</span>
        <span className="hidden md:block text-xs text-muted-foreground tabular-nums">{activeWeather.tempF}°</span>
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-[min(92vw,380px)] overflow-hidden rounded-2xl border border-glass-border bg-background/95 shadow-2xl backdrop-blur-xl">
          <div className="border-b border-glass-border/60 p-3">
            <div className="flex items-center gap-2 rounded-full border border-glass-border/70 bg-glass px-3 py-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search city, district, country…"
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
              {query && (
                <button onClick={() => setQuery("")} aria-label="Clear" className="text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <button
              onClick={detectCurrent}
              disabled={detecting}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-primary/15 px-3 py-2 text-sm font-medium text-primary hover:bg-primary/25 disabled:opacity-60"
            >
              {detecting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Navigation className="h-4 w-4" />}
              Use my current location
            </button>
            {detectError && <div className="mt-2 text-xs text-destructive">{detectError}</div>}
          </div>

          {query.trim().length >= 2 && (
            <div className="max-h-64 overflow-y-auto border-b border-glass-border/60 p-2">
              {searching && (
                <div className="flex items-center gap-2 px-2 py-3 text-xs text-muted-foreground">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Searching…
                </div>
              )}
              {!searching && suggestions.length === 0 && (
                <div className="px-2 py-3 text-xs text-muted-foreground">No matches for "{query}".</div>
              )}
              {suggestions.map((s) => (
                <button
                  key={`${s.name}-${s.lat}-${s.lon}`}
                  onClick={() => pickSuggestion(s)}
                  className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left text-sm hover:bg-accent/20"
                >
                  <MapPin className="h-4 w-4 shrink-0 text-primary" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium">{s.name}</div>
                    <div className="truncate text-[11px] text-muted-foreground">{s.region}</div>
                  </div>
                  <Plus className="h-4 w-4 text-muted-foreground" />
                </button>
              ))}
            </div>
          )}

          <div className="max-h-[340px] overflow-y-auto p-2">
            <div className="px-2 pb-1 pt-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Saved locations
            </div>
            {locations.map((loc) => (
              <SavedRow
                key={loc.id}
                loc={loc}
                isActive={loc.id === activeId}
                isHome={loc.id === homeId}
                renaming={renameId === loc.id}
                renameValue={renameValue}
                onSelect={() => {
                  setActive(loc.id);
                  setOpen(false);
                }}
                onSetHome={() => setHome(loc.id)}
                onToggleNotif={() => toggleNotifications(loc.id)}
                onRemove={() => removeLocation(loc.id)}
                onStartRename={() => {
                  setRenameId(loc.id);
                  setRenameValue(loc.label ?? "");
                }}
                onRenameChange={setRenameValue}
                onRenameCommit={() => {
                  renameLocation(loc.id, renameValue);
                  setRenameId(null);
                }}
                onRenameCancel={() => setRenameId(null)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SavedRow(props: {
  loc: SavedLocation;
  isActive: boolean;
  isHome: boolean;
  renaming: boolean;
  renameValue: string;
  onSelect: () => void;
  onSetHome: () => void;
  onToggleNotif: () => void;
  onRemove: () => void;
  onStartRename: () => void;
  onRenameChange: (v: string) => void;
  onRenameCommit: () => void;
  onRenameCancel: () => void;
}) {
  const {
    loc,
    isActive,
    isHome,
    renaming,
    renameValue,
    onSelect,
    onSetHome,
    onToggleNotif,
    onRemove,
    onStartRename,
    onRenameChange,
    onRenameCommit,
    onRenameCancel,
  } = props;
  const w = useMemo(() => weatherFor(loc), [loc]);
  return (
    <div
      className={cn(
        "group flex items-center gap-2 rounded-xl px-2 py-2 text-sm transition",
        isActive ? "bg-primary/10" : "hover:bg-accent/20",
      )}
    >
      <button onClick={onSelect} className="flex min-w-0 flex-1 items-center gap-3 text-left">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-glass border border-glass-border/60">
          {isHome ? <Home className="h-4 w-4 text-primary" /> : <MapPin className="h-4 w-4 text-muted-foreground" />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate font-medium">{loc.name}</span>
            {loc.label && !renaming && (
              <span className="rounded-full bg-accent/30 px-1.5 py-0.5 text-[10px] font-medium text-accent-foreground">
                {loc.label}
              </span>
            )}
            {isActive && <Check className="h-3.5 w-3.5 text-primary" />}
          </div>
          {renaming ? (
            <input
              autoFocus
              value={renameValue}
              onChange={(e) => onRenameChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") onRenameCommit();
                if (e.key === "Escape") onRenameCancel();
              }}
              onBlur={onRenameCommit}
              placeholder="Label (Home, Work…)"
              className="mt-1 w-full rounded-md border border-glass-border/70 bg-glass px-2 py-0.5 text-xs outline-none"
            />
          ) : (
            <div className="truncate text-[11px] text-muted-foreground">{loc.region}</div>
          )}
        </div>
        <div className="text-right">
          <div className="font-display text-sm font-semibold tabular-nums">{w.tempF}°</div>
          <div className="text-[10px] text-muted-foreground">{w.conditionLabel}</div>
        </div>
      </button>
      <div className="ml-1 flex items-center opacity-0 transition group-hover:opacity-100">
        <IconBtn label={isHome ? "Home location" : "Set as home"} onClick={onSetHome} active={isHome}>
          <Star className={cn("h-3.5 w-3.5", isHome && "fill-current")} />
        </IconBtn>
        <IconBtn label={loc.notifications ? "Mute alerts" : "Enable alerts"} onClick={onToggleNotif} active={!!loc.notifications}>
          {loc.notifications ? <Bell className="h-3.5 w-3.5" /> : <BellOff className="h-3.5 w-3.5" />}
        </IconBtn>
        <IconBtn label="Rename" onClick={onStartRename}>
          <Pencil className="h-3.5 w-3.5" />
        </IconBtn>
        <IconBtn label="Remove" onClick={onRemove}>
          <Trash2 className="h-3.5 w-3.5" />
        </IconBtn>
      </div>
    </div>
  );
}

function IconBtn({
  children,
  onClick,
  label,
  active,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      aria-label={label}
      title={label}
      className={cn(
        "grid h-7 w-7 place-items-center rounded-full text-muted-foreground hover:bg-accent/30 hover:text-foreground",
        active && "text-primary",
      )}
    >
      {children}
    </button>
  );
}
