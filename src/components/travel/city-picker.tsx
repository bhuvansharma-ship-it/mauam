import { useEffect, useState, type ReactNode } from "react";
import { Loader2, MapPin } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
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
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeoSuggestion[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }
    const ctrl = new AbortController();
    setLoading(true);
    const t = window.setTimeout(async () => {
      try {
        setResults(await searchCities(q, ctrl.signal));
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => {
      ctrl.abort();
      window.clearTimeout(t);
    };
  }, [query]);

  return (
    <div className="relative flex-1">
      <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {icon} {label}
      </label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            role="combobox"
            aria-expanded={open}
            aria-label={`${label}: ${value ? `${value.name}${value.region ? `, ${value.region}` : ""}` : placeholder}`}
            className="flex min-h-11 w-full items-center gap-2 rounded-2xl border border-border/60 bg-background/40 px-4 py-3 text-left text-sm hover:border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
        </PopoverTrigger>
        <PopoverContent align="start" className="w-[min(24rem,90vw)] p-0">
          <Command shouldFilter={false}>
            <CommandInput
              value={query}
              onValueChange={setQuery}
              placeholder="Search city…"
              aria-label="Search city"
            />
            <CommandList>
              {loading && (
                <div
                  className="flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground"
                  role="status"
                  aria-live="polite"
                >
                  <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" /> Searching…
                </div>
              )}
              {!loading && query.trim().length < 2 && (
                <div className="px-3 py-2 text-xs text-muted-foreground">
                  Type a city name to search.
                </div>
              )}
              {!loading && query.trim().length >= 2 && results.length === 0 && (
                <CommandEmpty>No matches.</CommandEmpty>
              )}
              {results.length > 0 && (
                <CommandGroup>
                  {results.map((r) => (
                    <CommandItem
                      key={`${r.name}-${r.lat}-${r.lon}`}
                      value={`${r.name}-${r.lat}-${r.lon}`}
                      onSelect={() => {
                        onChange(r);
                        setOpen(false);
                        setQuery("");
                      }}
                    >
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                      <span className="min-w-0 flex-1 truncate">
                        <span className="font-medium">{r.name}</span>
                        <span className="text-muted-foreground">, {r.region}</span>
                      </span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
