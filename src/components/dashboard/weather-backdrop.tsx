import type { CSSProperties } from "react";

type Kind = "storm" | "rain" | "sunshine" | "breeze" | "snow";

function pickKind(condition: string | undefined, tempC: number): Kind {
  const c = (condition ?? "").toLowerCase();
  if (c.includes("thunder") || c.includes("storm")) return "storm";
  if (c.includes("rain") || c.includes("drizzle") || c.includes("shower")) return "rain";
  if (c.includes("snow") || c.includes("sleet")) return "snow";
  if (c.includes("wind") || c.includes("breez")) return "breeze";
  if (c.includes("sun") || c.includes("clear")) return "sunshine";
  if (tempC >= 30) return "sunshine";
  if (tempC <= 5) return "snow";
  return "breeze";
}

export function WeatherBackdrop({ condition, tempC }: { condition?: string; tempC: number }) {
  const kind = pickKind(condition, tempC);
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-[inherit]"
    >
      {kind === "rain" && <Rain drops={40} />}
      {kind === "storm" && <Storm />}
      {kind === "sunshine" && <Sunshine />}
      {kind === "breeze" && <Breeze />}
      {kind === "snow" && <Snow />}
    </div>
  );
}

function Rain({ drops = 40, heavy = false }: { drops?: number; heavy?: boolean }) {
  return (
    <div className="absolute inset-0">
      {Array.from({ length: drops }).map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 1.5;
        const dur = 0.6 + Math.random() * 0.7;
        const h = heavy ? 18 + Math.random() * 14 : 10 + Math.random() * 10;
        const style: CSSProperties = {
          left: `${left}%`,
          animationDelay: `${delay}s`,
          animationDuration: `${dur}s`,
          height: `${h}px`,
          opacity: 0.25 + Math.random() * 0.35,
        };
        return <span key={i} className="wb-drop" style={style} />;
      })}
      <style>{`
        .wb-drop {
          position: absolute;
          top: -20px;
          width: 1.5px;
          background: linear-gradient(to bottom, transparent, rgba(180,210,255,0.9));
          transform: translateY(0) rotate(12deg);
          animation-name: wb-fall;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          border-radius: 2px;
        }
        @keyframes wb-fall {
          0%   { transform: translateY(-20px) rotate(12deg); }
          100% { transform: translateY(120%) rotate(12deg); }
        }
      `}</style>
    </div>
  );
}

function Storm() {
  return (
    <div className="absolute inset-0">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/20 via-transparent to-slate-900/30" />
      <Rain drops={70} heavy />
      <span className="wb-flash" />
      <style>{`
        .wb-flash {
          position: absolute; inset: 0;
          background: radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.85), transparent 55%);
          opacity: 0;
          animation: wb-lightning 6s ease-in-out infinite;
          mix-blend-mode: screen;
        }
        @keyframes wb-lightning {
          0%, 92%, 100% { opacity: 0; }
          93% { opacity: 0.9; }
          94% { opacity: 0.1; }
          95% { opacity: 0.7; }
          96% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}

function Sunshine() {
  return (
    <div className="absolute inset-0">
      <div className="wb-sun" />
      <div className="wb-rays" />
      <div className="wb-glow" />
      <style>{`
        .wb-sun {
          position: absolute;
          top: -60px; right: -40px;
          width: 240px; height: 240px;
          border-radius: 9999px;
          background: radial-gradient(circle, rgba(255,220,120,0.55) 0%, rgba(255,180,80,0.15) 40%, transparent 70%);
          filter: blur(4px);
          animation: wb-pulse 6s ease-in-out infinite;
        }
        .wb-rays {
          position: absolute;
          top: -80px; right: -60px;
          width: 320px; height: 320px;
          background: conic-gradient(from 0deg,
            rgba(255,220,140,0.18) 0deg, transparent 12deg,
            rgba(255,220,140,0.18) 30deg, transparent 42deg,
            rgba(255,220,140,0.18) 60deg, transparent 72deg,
            rgba(255,220,140,0.18) 90deg, transparent 102deg,
            rgba(255,220,140,0.18) 120deg, transparent 132deg,
            rgba(255,220,140,0.18) 150deg, transparent 162deg,
            rgba(255,220,140,0.18) 180deg, transparent 192deg,
            rgba(255,220,140,0.18) 210deg, transparent 222deg,
            rgba(255,220,140,0.18) 240deg, transparent 252deg,
            rgba(255,220,140,0.18) 270deg, transparent 282deg,
            rgba(255,220,140,0.18) 300deg, transparent 312deg,
            rgba(255,220,140,0.18) 330deg, transparent 342deg);
          border-radius: 9999px;
          animation: wb-spin 40s linear infinite;
          mask: radial-gradient(circle, transparent 30%, black 55%, transparent 90%);
        }
        .wb-glow {
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,200,100,0.08), transparent 60%);
        }
        @keyframes wb-pulse {
          0%,100% { transform: scale(1); opacity: 0.9; }
          50%     { transform: scale(1.06); opacity: 1; }
        }
        @keyframes wb-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

function Breeze() {
  return (
    <div className="absolute inset-0">
      {Array.from({ length: 8 }).map((_, i) => {
        const top = 10 + Math.random() * 80;
        const delay = Math.random() * 6;
        const dur = 8 + Math.random() * 8;
        const w = 80 + Math.random() * 140;
        const op = 0.15 + Math.random() * 0.25;
        return (
          <span
            key={i}
            className="wb-wind"
            style={{
              top: `${top}%`,
              width: `${w}px`,
              animationDelay: `${delay}s`,
              animationDuration: `${dur}s`,
              opacity: op,
            }}
          />
        );
      })}
      <style>{`
        .wb-wind {
          position: absolute;
          left: -200px;
          height: 2px;
          border-radius: 9999px;
          background: linear-gradient(to right, transparent, rgba(200,230,255,0.9), transparent);
          animation-name: wb-drift;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          filter: blur(0.5px);
        }
        @keyframes wb-drift {
          0%   { transform: translateX(0); }
          100% { transform: translateX(140vw); }
        }
      `}</style>
    </div>
  );
}

function Snow() {
  return (
    <div className="absolute inset-0">
      {Array.from({ length: 40 }).map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 6;
        const dur = 6 + Math.random() * 8;
        const size = 2 + Math.random() * 4;
        return (
          <span
            key={i}
            className="wb-flake"
            style={{
              left: `${left}%`,
              width: `${size}px`,
              height: `${size}px`,
              animationDelay: `${delay}s`,
              animationDuration: `${dur}s`,
              opacity: 0.5 + Math.random() * 0.5,
            }}
          />
        );
      })}
      <style>{`
        .wb-flake {
          position: absolute;
          top: -10px;
          background: white;
          border-radius: 9999px;
          animation-name: wb-snowfall;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          filter: blur(0.3px);
        }
        @keyframes wb-snowfall {
          0%   { transform: translate(0, -10px); }
          100% { transform: translate(20px, 120%); }
        }
      `}</style>
    </div>
  );
}
