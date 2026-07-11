import { useEffect, useRef, useState, type ReactNode } from "react";
import { Loader2, MapPin, Search } from "lucide-react";
import { searchCities, type GeoSuggestion } from "../../lib/locations";

export type Point = { name: string; region: string; country: string; lat: number; lon: number };

export function CityPicker({
  label,
  icon,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  icon: ReactNode;
  value: Point | null;
  onChange: (p: Point) => void;
  placeholder: string;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState<GeoSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) { setResults([]); return; }
    const ctrl = new AbortController();
    setLoading(true);
    const t = window.setTimeout(async () => {
      try { setResults(await searchCities(q, ctrl.signal)); }
      catch { setResults([]); }
      finally { setLoading(false); }
    }, 250);
    return () => { ctrl.abort(); window.clearTimeout(t); };
  }, [query]);

  return (
    <div ref={boxRef} className="relative flex-1">
      <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {icon} {label}
      </label>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={`Select ${label.toLowerCase()} city`}
        className="flex min-h-11 w-full items-center gap-2 rounded-2xl border border-border/60 bg-background/40 px-4 py-3 text-left text-sm hover:border-border"
      >
        <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        {value ? (
          <span className="min-w-0 flex-1 truncate">
            <span className="font-medium">{value.name}</span>
            {value.region && <span className="text-muted-foreground">, {value.region}</span>}
          </span>
        ) : (
          <span className="flex-1 text-muted-foreground">{placeholder}</span>
        )}
      </button>
      {open && (
        <div className="absolute inset-x-0 top-full z-30 mt-2 overflow-hidden rounded-2xl border border-border bg-popover shadow-xl">
          <div className="flex items-center gap-2 border-b border-border/60 px-3 py-2">
            <Search className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search city…"
              aria-label="Search city"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            {loading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" aria-hidden="true" />}
          </div>
          <div className="max-h-64 overflow-y-auto">
            {results.length === 0 && query.trim().length >= 2 && !loading ? (
              <div className="p-3 text-xs text-muted-foreground">No matches.</div>
            ) : results.length === 0 ? (
              <div className="p-3 text-xs text-muted-foreground">Type a city name to search.</div>
            ) : (
              results.map((r) => (
                <button
                  key={`${r.name}-${r.lat}-${r.lon}`}
                  onClick={() => { onChange(r); setOpen(false); setQuery(""); }}
                  className="flex w-full items-center gap-2 border-b border-border/40 px-3 py-2 text-left text-sm last:border-b-0 hover:bg-accent"
                >
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                  <span className="min-w-0 flex-1 truncate">
                    <span className="font-medium">{r.name}</span>
                    <span className="text-muted-foreground">, {r.region}</span>
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
