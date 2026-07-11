import { createFileRoute } from "@tanstack/react-router";
import { Checklist } from "../../components/dashboard/checklist";
import { PreparednessScore } from "../../components/dashboard/preparedness-score";

export const Route = createFileRoute("/_authenticated/checklist")({
  head: () => ({
    meta: [
      { title: "Emergency Preparedness Checklist — Mausam" },
      { name: "description", content: "Build your emergency preparedness step by step." },
      { property: "og:title", content: "Emergency Preparedness Checklist — Mausam" },
    ],
  }),
  component: () => (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Preparedness checklist</h1>
        <p className="mt-1 text-sm text-muted-foreground">A calm, thorough guide to being ready before you need to be.</p>
      </div>
      <div className="grid grid-cols-12 gap-5">
        <PreparednessScore />
        <Checklist />
      </div>
    </div>
  ),
});
