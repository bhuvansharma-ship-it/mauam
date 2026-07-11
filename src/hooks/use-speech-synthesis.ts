import { useEffect, useRef } from "react";

/**
 * Speaks `text` once each time `id` changes, provided `enabled` is true.
 * Cancels any in-flight utterance before starting the new one.
 */
export function useSpeakOnce({
  id,
  text,
  enabled = true,
  rate = 1.02,
  maxChars = 500,
}: {
  id: string | null | undefined;
  text: string;
  enabled?: boolean;
  rate?: number;
  maxChars?: number;
}) {
  const spokenIdRef = useRef<string | null>(null);
  useEffect(() => {
    if (!enabled || !id || spokenIdRef.current === id) return;
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const trimmed = text.trim();
    if (!trimmed) return;
    spokenIdRef.current = id;
    const utter = new SpeechSynthesisUtterance(trimmed.slice(0, maxChars));
    utter.rate = rate;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  }, [id, text, enabled, rate, maxChars]);
}
