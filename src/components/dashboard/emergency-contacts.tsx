import { Phone } from "lucide-react";
import { GlassCard } from "../glass-card";
import { contacts } from "../../lib/mock/emergency";
import { cn } from "../../lib/utils";

export function EmergencyContacts() {
  return (
    <GlassCard className="col-span-12 sm:col-span-6 lg:col-span-4">
      <div className="p-5 sm:p-6">
        <div className="mb-3 flex items-center gap-2">
          <Phone className="h-4 w-4" />
          <h3 className="font-display text-lg font-semibold">Emergency contacts</h3>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {contacts.map((c) => (
            <a
              key={c.id}
              href={`tel:${c.phone}`}
              className={cn(
                "flex flex-col rounded-2xl border p-3 transition hover:scale-[1.02]",
                c.kind === "emergency"
                  ? "border-weather-critical/40 bg-weather-critical/5"
                  : "border-glass-border/60 bg-glass",
              )}
            >
              <div className="truncate text-xs font-medium text-muted-foreground">
                {c.kind === "emergency" ? "Emergency" : "Personal"}
              </div>
              <div className="truncate text-sm font-semibold">{c.name}</div>
              <div className="mt-1 font-display text-base font-bold tabular-nums">{c.phone}</div>
            </a>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}
