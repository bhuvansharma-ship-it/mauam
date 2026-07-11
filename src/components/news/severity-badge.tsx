import type { NewsSeverity } from "../../lib/mock/news";
import { cn } from "../../lib/utils";

const label: Record<NewsSeverity, string> = {
  breaking: "Breaking",
  critical: "Critical",
  advisory: "Advisory",
  official: "Official",
  info: "Update",
};
const style: Record<NewsSeverity, string> = {
  breaking: "bg-news-breaking text-white animate-pulse-alert",
  critical: "bg-news-breaking/90 text-white",
  advisory: "bg-news-advisory text-background",
  official: "bg-news-official text-white",
  info: "bg-news-info/25 text-foreground",
};

export function SeverityBadge({
  severity,
  className,
}: {
  severity: NewsSeverity;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
        style[severity],
        className,
      )}
    >
      {label[severity]}
    </span>
  );
}
