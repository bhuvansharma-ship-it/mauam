import { createFileRoute } from "@tanstack/react-router";
import { faq } from "../lib/mock/emergency";
import { GlassCard } from "../components/glass-card";
import { BookOpen } from "lucide-react";

export const Route = createFileRoute("/knowledge")({
  head: () => ({
    meta: [
      { title: "Knowledge Hub — Aurora Guardian" },
      { name: "description", content: "Illustrated safety guides for earthquakes, floods, wildfires, storms and more." },
      { property: "og:title", content: "Knowledge Hub — Aurora Guardian" },
    ],
  }),
  component: () => (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Knowledge hub</h1>
        <p className="mt-1 text-sm text-muted-foreground">Clear, calm guidance from trusted emergency management sources.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {faq.map((f) => (
          <GlassCard key={f.id} className="transition hover:-translate-y-0.5">
            <div className="p-5">
              <div className="mb-3 grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-primary to-accent"><BookOpen className="h-5 w-5 text-primary-foreground" /></div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-primary">{f.category}</div>
              <div className="mt-1 font-display text-lg font-semibold">{f.title}</div>
              <p className="mt-1 text-sm text-muted-foreground">{f.summary}</p>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  ),
});
