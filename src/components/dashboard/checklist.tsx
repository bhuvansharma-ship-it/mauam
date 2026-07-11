import { Check } from "lucide-react";
import { useState } from "react";
import { GlassCard } from "../glass-card";
import { initialChecklist, type ChecklistItem } from "../../lib/mock/emergency";
import { cn } from "../../lib/utils";

export function Checklist() {
  const [items, setItems] = useState<ChecklistItem[]>(initialChecklist);
  const groups = Array.from(new Set(items.map((i) => i.group)));
  const done = items.filter((i) => i.done).length;
  return (
    <GlassCard className="col-span-12 sm:col-span-6 lg:col-span-4">
      <div className="p-5 sm:p-6">
        <div className="mb-3 flex items-baseline justify-between">
          <h3 className="font-display text-lg font-semibold">Emergency checklist</h3>
          <span className="text-xs text-muted-foreground tabular-nums">{done}/{items.length}</span>
        </div>
        <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-muted/60">
          <div className="h-full rounded-full bg-gradient-to-r from-weather-safe to-primary" style={{ width: `${(done / items.length) * 100}%` }} />
        </div>
        <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
          {groups.map((g) => (
            <div key={g}>
              <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{g}</div>
              <ul className="space-y-1">
                {items.filter((i) => i.group === g).map((i) => (
                  <li key={i.id}>
                    <button
                      onClick={() => setItems((prev) => prev.map((x) => x.id === i.id ? { ...x, done: !x.done } : x))}
                      className="flex w-full items-center gap-3 rounded-xl px-2 py-1.5 text-left text-sm hover:bg-accent/15"
                    >
                      <span className={cn("grid h-5 w-5 shrink-0 place-items-center rounded-md border transition", i.done ? "border-weather-safe bg-weather-safe text-background" : "border-muted-foreground/40")}>
                        {i.done && <Check className="h-3.5 w-3.5" />}
                      </span>
                      <span className={cn(i.done && "text-muted-foreground line-through")}>{i.text}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}
