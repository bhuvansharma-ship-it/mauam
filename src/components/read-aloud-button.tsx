import { Loader2, Square, Volume2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { TTS_INSTRUCTIONS, getLanguage, type LangCode } from "../lib/i18n";
import { cn } from "../lib/utils";

type Props = {
  text: string;
  className?: string;
  size?: "sm" | "md";
  label?: string;
};

export function ReadAloudButton({ text, className, size = "sm", label }: Props) {
  const { t } = useTranslation();
  const [state, setState] = useState<"idle" | "loading" | "playing">("idle");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const urlRef = useRef<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function stop() {
    audioRef.current?.pause();
    audioRef.current = null;
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current);
      urlRef.current = null;
    }
    abortRef.current?.abort();
    abortRef.current = null;
    setState("idle");
  }

  async function play() {
    if (!text.trim()) return;
    stop();
    setState("loading");
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    try {
      const lang = getLanguage() as LangCode;
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: text.slice(0, 3800),
          voice: "alloy",
          instructions: TTS_INSTRUCTIONS[lang] ?? TTS_INSTRUCTIONS.en,
        }),
        signal: ctrl.signal,
      });
      if (!res.ok) throw new Error(await res.text().catch(() => `TTS ${res.status}`));
      const blob = await res.blob();
      if (ctrl.signal.aborted) return;
      const url = URL.createObjectURL(blob);
      urlRef.current = url;
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => stop();
      audio.onerror = () => stop();
      await audio.play();
      setState("playing");
    } catch (err) {
      if ((err as { name?: string }).name === "AbortError") return;
      console.error("Read aloud failed:", err);
      stop();
    }
  }

  const isBusy = state !== "idle";
  const sizes = size === "md" ? "h-9 px-3 text-sm" : "h-7 px-2.5 text-xs";

  return (
    <button
      type="button"
      onClick={isBusy ? stop : play}
      aria-label={isBusy ? t("common.stop") : t("common.readAloud")}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-glass-border/60 bg-glass font-medium transition hover:bg-accent/20 disabled:opacity-60",
        sizes,
        className,
      )}
    >
      {state === "loading" ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
      ) : state === "playing" ? (
        <Square className="h-3.5 w-3.5" aria-hidden="true" />
      ) : (
        <Volume2 className="h-3.5 w-3.5" aria-hidden="true" />
      )}
      <span>{label ?? (isBusy ? t("common.stop") : t("common.readAloud"))}</span>
    </button>
  );
}
