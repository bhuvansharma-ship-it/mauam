import { BadgeCheck, Landmark } from "lucide-react";
import type { Source } from "../../lib/mock/news";

export function SourceBadge({ source }: { source: Source }) {
  return (
    <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
      {source.official ? (
        <Landmark className="h-3 w-3 text-news-official" />
      ) : source.verified ? (
        <BadgeCheck className="h-3 w-3 text-news-info" />
      ) : null}
      <span className="font-medium">{source.name}</span>
    </span>
  );
}
