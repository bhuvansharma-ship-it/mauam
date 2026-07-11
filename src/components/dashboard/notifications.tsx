import { Bell, CloudRain, Newspaper, Shield } from "lucide-react";
import { GlassCard } from "../glass-card";
import { notifications } from "../../lib/mock/emergency";
import { timeAgo } from "../../lib/format-time";

const iconFor = { alert: CloudRain, news: Newspaper, system: Shield };

export function Notifications() {
  return (
    <GlassCard className="col-span-12 sm:col-span-6 lg:col-span-4">
      <div className="p-5 sm:p-6">
        <div className="mb-3 flex items-center gap-2">
          <Bell className="h-4 w-4" />
          <h3 className="font-display text-lg font-semibold">Recent notifications</h3>
        </div>
        <ul className="space-y-2">
          {notifications.map((n) => {
            const Icon = iconFor[n.kind];
            return (
              <li key={n.id} className="flex items-start gap-3 rounded-2xl border border-glass-border/50 bg-glass p-3">
                <div className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-accent/15"><Icon className="h-4 w-4" /></div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm">{n.title}</div>
                  <div className="mt-0.5 text-[11px] text-muted-foreground">{timeAgo(n.time)}</div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </GlassCard>
  );
}
