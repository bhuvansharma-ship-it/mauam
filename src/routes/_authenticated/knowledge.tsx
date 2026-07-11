import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, CheckCircle2, ExternalLink, Info } from "lucide-react";
import { GlassCard } from "../../components/glass-card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../components/ui/accordion";
import { knowledge } from "../../lib/knowledge";

export const Route = createFileRoute("/_authenticated/knowledge")({
  head: () => ({
    meta: [
      { title: "Knowledge Hub — Mausam" },
      {
        name: "description",
        content:
          "In-depth safety guides for earthquakes, floods, wildfires, cyclones, heatwaves, storms, power outages and home emergency kits — from CDC, NOAA, NDMA, USGS and Ready.gov.",
      },
      { property: "og:title", content: "Knowledge Hub — Mausam" },
      {
        property: "og:description",
        content:
          "Step-by-step preparedness guides sourced from official emergency management agencies.",
      },
    ],
  }),
  component: KnowledgeHubPage,
});

function KnowledgeHubPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Knowledge hub
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Clear, calm guidance drawn from trusted emergency-management agencies —
          CDC, NOAA, NDMA, USGS and Ready.gov. Each topic covers what to do
          before, during and after, plus the mistakes that cause most injuries.
        </p>
      </header>

      <nav aria-label="Topics" className="flex flex-wrap gap-2">
        {knowledge.map((k) => (
          <a
            key={k.id}
            href={`#${k.slug}`}
            className="rounded-full border border-glass-border/60 bg-glass px-3 py-1 text-xs font-medium transition hover:border-primary/40 hover:bg-accent/20"
          >
            {k.category}
          </a>
        ))}
      </nav>

      <div className="grid gap-6 lg:grid-cols-2">
        {knowledge.map((topic) => {
          const Icon = topic.icon;
          return (
            <GlassCard key={topic.id} className="scroll-mt-24" id={topic.slug}>
              <article className="p-5 sm:p-6">
                <div className="flex items-start gap-4">
                  <div
                    className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-primary to-accent"
                    style={{ backgroundImage: `linear-gradient(135deg, hsl(${topic.hue} 85% 55%), hsl(${(topic.hue + 40) % 360} 85% 55%))` }}
                  >
                    <Icon className="h-6 w-6 text-primary-foreground" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                      {topic.category}
                    </div>
                    <h2 className="mt-0.5 font-display text-xl font-semibold">{topic.title}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">{topic.summary}</p>
                  </div>
                </div>

                <dl className="mt-4 grid grid-cols-3 gap-2 rounded-2xl border border-glass-border/50 bg-glass p-3 text-center">
                  {topic.quickFacts.map((f) => (
                    <div key={f.label}>
                      <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        {f.label}
                      </dt>
                      <dd className="mt-0.5 text-xs font-semibold">{f.value}</dd>
                    </div>
                  ))}
                </dl>

                <Accordion type="multiple" defaultValue={[`${topic.slug}-0`]} className="mt-4">
                  {topic.sections.map((section, i) => (
                    <AccordionItem key={section.heading} value={`${topic.slug}-${i}`}>
                      <AccordionTrigger className="text-sm font-semibold">
                        <span className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary" aria-hidden="true" />
                          {section.heading}
                        </span>
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-1.5 pl-1 text-sm text-muted-foreground">
                          {section.points.map((p, j) => (
                            <li key={j} className="flex gap-2">
                              <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary/70" />
                              <span className="text-foreground/90">{p}</span>
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>

                <div className="mt-4 rounded-2xl border border-destructive/30 bg-destructive/5 p-3">
                  <div className="mb-1.5 flex items-center gap-2 text-xs font-semibold text-destructive">
                    <AlertTriangle className="h-4 w-4" aria-hidden="true" /> Do not
                  </div>
                  <ul className="space-y-1 text-xs text-foreground/90">
                    {topic.doNots.map((d, i) => (
                      <li key={i} className="flex gap-2">
                        <span aria-hidden="true" className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-destructive" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-glass-border/40 pt-3 text-xs text-muted-foreground">
                  <Info className="h-3 w-3" aria-hidden="true" />
                  <span>Sources:</span>
                  {topic.sources.map((s, i) => (
                    <a
                      key={s.url}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-primary hover:underline"
                    >
                      {s.name}
                      <ExternalLink className="h-3 w-3" aria-hidden="true" />
                      {i < topic.sources.length - 1 ? <span className="text-muted-foreground">·</span> : null}
                    </a>
                  ))}
                </div>
              </article>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}
