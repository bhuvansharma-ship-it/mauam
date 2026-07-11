import type { ReactNode } from "react";
import { cn } from "../lib/utils";

export function GlassCard({
  children,
  className,
  as: As = "div",
  glow,
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "article";
  glow?: "primary" | "accent" | "critical" | "warning";
}) {
  const glowMap = {
    primary: "before:bg-primary/20",
    accent: "before:bg-accent/20",
    critical: "before:bg-weather-critical/25",
    warning: "before:bg-weather-warning/20",
  } as const;
  return (
    <As
      className={cn(
        "glass relative overflow-hidden rounded-3xl",
        glow &&
          "before:pointer-events-none before:absolute before:-top-24 before:-right-16 before:h-64 before:w-64 before:rounded-full before:blur-3xl",
        glow && glowMap[glow],
        className,
      )}
    >
      {children}
    </As>
  );
}
