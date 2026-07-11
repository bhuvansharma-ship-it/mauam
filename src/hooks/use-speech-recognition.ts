import { useCallback, useRef, useState } from "react";

// Minimal Web Speech API typing
type SpeechRecognitionCtor = new () => {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: (e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void;
  onend: () => void;
  onerror: (e: unknown) => void;
  start: () => void;
  stop: () => void;
};

function getCtor(): SpeechRecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
}

export interface UseSpeechRecognitionOptions {
  onTranscript?: (text: string) => void;
  onFinal?: (text: string) => void;
  onUnsupported?: () => void;
}

export function useSpeechRecognition({
  onTranscript,
  onFinal,
  onUnsupported,
}: UseSpeechRecognitionOptions = {}) {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<InstanceType<SpeechRecognitionCtor> | null>(null);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
  }, []);

  const start = useCallback(() => {
    const Ctor = getCtor();
    if (!Ctor) {
      onUnsupported?.();
      return;
    }
    if (recognitionRef.current) {
      stop();
      return;
    }
    const rec = new Ctor();
    rec.lang = navigator.language || "en-US";
    rec.interimResults = true;
    rec.continuous = false;
    let finalText = "";
    rec.onresult = (e) => {
      let interim = "";
      for (let i = 0; i < e.results.length; i++) {
        const chunk = e.results[i][0].transcript;
        if (i === e.results.length - 1) interim = chunk;
        else finalText += chunk;
      }
      onTranscript?.((finalText + interim).trim());
    };
    rec.onend = () => {
      setListening(false);
      recognitionRef.current = null;
      const spoken = finalText.trim();
      if (spoken) onFinal?.(spoken);
    };
    rec.onerror = () => {
      setListening(false);
      recognitionRef.current = null;
    };
    recognitionRef.current = rec;
    setListening(true);
    rec.start();
  }, [onTranscript, onFinal, onUnsupported, stop]);

  const toggle = useCallback(() => {
    if (listening) stop();
    else start();
  }, [listening, start, stop]);

  return { listening, start, stop, toggle };
}
