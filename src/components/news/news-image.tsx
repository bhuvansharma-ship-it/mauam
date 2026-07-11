import { Activity, Cloud, CloudLightning, Flame, Heart, Landmark, Mountain, Route, Thermometer, Waves, Wind } from "lucide-react";
import type { Article } from "../../lib/mock/news";

const map = {
  storm: CloudLightning, flood: Waves, fire: Flame, heat: Thermometer,
  quake: Activity, wind: Wind, health: Heart, road: Route, gov: Landmark,
} as const;

export function NewsImage({ article, className = "" }: { article: Article; className?: string }) {
  const Icon = map[article.image.icon] ?? Cloud;
  const h = article.image.hue;
  return (
    <div
      className={"relative flex items-center justify-center overflow-hidden " + className}
      style={{
        background: `linear-gradient(135deg, oklch(0.45 0.14 ${h}) 0%, oklch(0.32 0.1 ${(h + 40) % 360}) 60%, oklch(0.22 0.08 ${(h + 80) % 360}) 100%)`,
      }}
    >
      {article.image.icon === "storm" && <Mountain className="absolute bottom-0 left-0 h-full w-full text-white/10" />}
      <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 30% 40%, oklch(1 0 0 / 0.15), transparent 60%)` }} />
      <Icon className="relative z-10 h-16 w-16 text-white/85 drop-shadow-lg" strokeWidth={1.5} />
    </div>
  );
}
