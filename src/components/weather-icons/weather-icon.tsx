import type { Condition } from "../../lib/mock/weather";
import { cn } from "../../lib/utils";

export function WeatherIcon({
  condition,
  className,
  animated = true,
}: {
  condition: Condition;
  className?: string;
  animated?: boolean;
}) {
  const c = cn("h-full w-full", className);
  switch (condition) {
    case "sunny":
      return (
        <svg viewBox="0 0 120 120" className={c}>
          <defs>
            <radialGradient id="s-sun" cx="50%" cy="50%">
              <stop offset="0%" stopColor="var(--color-weather-sunny)" stopOpacity="1" />
              <stop offset="100%" stopColor="var(--color-weather-heat)" stopOpacity="1" />
            </radialGradient>
          </defs>
          <g className={animated ? "animate-float" : ""}>
            {Array.from({ length: 12 }).map((_, i) => {
              const a = (i * Math.PI) / 6;
              return (
                <line
                  key={i}
                  x1={60 + Math.cos(a) * 34}
                  y1={60 + Math.sin(a) * 34}
                  x2={60 + Math.cos(a) * 48}
                  y2={60 + Math.sin(a) * 48}
                  stroke="var(--color-weather-sunny)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  opacity="0.85"
                />
              );
            })}
            <circle cx="60" cy="60" r="24" fill="url(#s-sun)" />
          </g>
        </svg>
      );
    case "partly-cloudy":
      return (
        <svg viewBox="0 0 120 120" className={c}>
          <defs>
            <radialGradient id="pc-sun" cx="50%" cy="50%">
              <stop offset="0%" stopColor="var(--color-weather-sunny)" />
              <stop offset="100%" stopColor="var(--color-weather-heat)" />
            </radialGradient>
          </defs>
          <circle
            cx="42"
            cy="42"
            r="20"
            fill="url(#pc-sun)"
            className={animated ? "animate-float" : ""}
          />
          <g className={animated ? "animate-float" : ""} style={{ animationDelay: "0.5s" }}>
            <ellipse cx="72" cy="72" rx="34" ry="18" fill="oklch(0.95 0.01 250)" opacity="0.95" />
            <ellipse cx="58" cy="68" rx="20" ry="14" fill="oklch(1 0 0)" opacity="0.95" />
            <ellipse cx="86" cy="70" rx="18" ry="12" fill="oklch(1 0 0)" opacity="0.9" />
          </g>
        </svg>
      );
    case "cloudy":
      return (
        <svg viewBox="0 0 120 120" className={c}>
          <g className={animated ? "animate-float" : ""}>
            <ellipse cx="60" cy="66" rx="42" ry="20" fill="oklch(0.88 0.015 250)" />
            <ellipse cx="45" cy="60" rx="22" ry="16" fill="oklch(0.96 0.008 250)" />
            <ellipse cx="76" cy="62" rx="20" ry="14" fill="oklch(0.96 0.008 250)" />
          </g>
        </svg>
      );
    case "rain":
      return (
        <svg viewBox="0 0 120 120" className={c}>
          <g>
            <ellipse cx="60" cy="48" rx="38" ry="18" fill="oklch(0.6 0.05 260)" />
            <ellipse cx="46" cy="42" rx="20" ry="14" fill="oklch(0.72 0.04 260)" />
            <ellipse cx="76" cy="44" rx="18" ry="12" fill="oklch(0.72 0.04 260)" />
          </g>
          {[0, 1, 2, 3, 4].map((i) => (
            <line
              key={i}
              x1={38 + i * 12}
              y1={70}
              x2={34 + i * 12}
              y2={100}
              stroke="var(--color-weather-rain)"
              strokeWidth="3"
              strokeLinecap="round"
              style={
                animated ? { animation: `rain-fall 1.2s linear ${i * 0.15}s infinite` } : undefined
              }
            />
          ))}
        </svg>
      );
    case "storm":
      return (
        <svg viewBox="0 0 120 120" className={c}>
          <ellipse cx="60" cy="46" rx="40" ry="20" fill="oklch(0.35 0.04 280)" />
          <ellipse cx="48" cy="40" rx="20" ry="14" fill="oklch(0.5 0.05 280)" />
          <path
            d="M58 68 L48 90 L60 90 L52 108 L74 82 L62 82 L70 68 Z"
            fill="var(--color-weather-sunny)"
            className={animated ? "animate-pulse-alert" : ""}
          />
        </svg>
      );
    case "snow":
      return (
        <svg viewBox="0 0 120 120" className={c}>
          <ellipse cx="60" cy="50" rx="38" ry="18" fill="var(--color-weather-snow)" />
          {[0, 1, 2, 3, 4].map((i) => (
            <text
              key={i}
              x={30 + i * 15}
              y={90 + (i % 2) * 8}
              fill="var(--color-weather-snow)"
              fontSize="18"
            >
              ❄
            </text>
          ))}
        </svg>
      );
    case "fog":
      return (
        <svg viewBox="0 0 120 120" className={c}>
          {[0, 1, 2, 3].map((i) => (
            <rect
              key={i}
              x={20}
              y={40 + i * 14}
              width="80"
              height="6"
              rx="3"
              fill="oklch(0.85 0.01 250)"
              opacity={0.85 - i * 0.15}
            />
          ))}
        </svg>
      );
  }
}
