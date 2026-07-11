import { MapPin, Mic, MicOff, Send, Sparkles, Square } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { GlassCard } from "../glass-card";
import { useLocation } from "../../lib/locations";

const SUGGESTIONS = [
  "Is it safe to travel today?",
  "What should I do about a flood warning here?",
  "Build me a 24-hour blackout checklist",
  "First-aid steps for heat exhaustion",
];

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

export function AIAssistant() {
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<InstanceType<SpeechRecognitionCtor> | null>(null);
  const { active, locations } = useLocation();

  const initial = useMemo<UIMessage[]>(
    () => [
      {
        id: "welcome",
        role: "assistant",
        parts: [
          {
            type: "text",
            text: `I'm Aurora — your emergency assistant, tuned to ${active.name}${
              active.label ? ` (${active.label})` : ""
            }. Ask about alerts, checklists, evacuation routes, first aid, or shelter locations. You can type or tap the mic to talk.`,
          },
        ],
      },
    ],
    // Only re-init the welcome message when the active location changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [active.id],
  );

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        body: {
          location: {
            name: active.name,
            region: active.region,
            country: active.country,
            lat: active.lat,
            lon: active.lon,
            label: active.label,
            savedLocations: locations.map((l) => ({ name: l.name, region: l.region, label: l.label })),
          },
        },
      }),
    [active, locations],
  );

  const { messages, sendMessage, setMessages, status, stop, error } = useChat({
    transport,
    messages: initial,
  });

  // When the active location changes, reset the conversation so the welcome + system context refresh.
  useEffect(() => {
    setMessages(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active.id]);

  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  const send = (text: string) => {
    const t = text.trim();
    if (!t || isLoading) return;
    void sendMessage({ text: t });
    setInput("");
  };

  const toggleMic = () => {
    if (typeof window === "undefined") return;
    const w = window as unknown as {
      SpeechRecognition?: SpeechRecognitionCtor;
      webkitSpeechRecognition?: SpeechRecognitionCtor;
    };
    const Ctor = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!Ctor) {
      alert("Voice input isn't supported in this browser. Try Chrome or Edge.");
      return;
    }
    if (listening && recognitionRef.current) {
      recognitionRef.current.stop();
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
      setInput((finalText + interim).trim());
    };
    rec.onend = () => {
      setListening(false);
      const spoken = (finalText || input).trim();
      if (spoken) send(spoken);
    };
    rec.onerror = () => setListening(false);
    recognitionRef.current = rec;
    setListening(true);
    rec.start();
  };

  // Speak the latest assistant message when it finishes streaming.
  const lastAssistantId = [...messages].reverse().find((m) => m.role === "assistant")?.id;
  const spokenIdRef = useRef<string | null>(null);
  useEffect(() => {
    if (isLoading || !lastAssistantId || spokenIdRef.current === lastAssistantId) return;
    if (lastAssistantId === "welcome") {
      spokenIdRef.current = lastAssistantId;
      return;
    }
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const msg = messages.find((m) => m.id === lastAssistantId);
    if (!msg) return;
    const text = msg.parts.map((p) => (p.type === "text" ? p.text : "")).join(" ").trim();
    if (!text) return;
    spokenIdRef.current = lastAssistantId;
    const utter = new SpeechSynthesisUtterance(text.slice(0, 500));
    utter.rate = 1.02;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  }, [isLoading, lastAssistantId, messages]);

  return (
    <GlassCard className="col-span-12 lg:col-span-4" glow="primary">
      <div className="flex h-full flex-col p-5 sm:p-6">
        <div className="mb-3 flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-primary to-accent">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className="min-w-0">
            <h3 className="font-display text-base font-semibold">AI Emergency Assistant</h3>
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              {isLoading ? (
                "Aurora is thinking…"
              ) : (
                <>
                  <MapPin className="h-3 w-3" /> {active.name} · Voice + text
                </>
              )}
            </div>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 space-y-2 overflow-y-auto pr-1 min-h-[160px] max-h-[260px]">
          {messages.map((m) => {
            const text = m.parts.map((p) => (p.type === "text" ? p.text : "")).join("");
            return (
              <div
                key={m.id}
                className={
                  m.role === "user"
                    ? "ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-primary/20 px-3 py-2 text-sm whitespace-pre-wrap"
                    : "mr-auto max-w-[85%] rounded-2xl rounded-tl-sm bg-muted/60 px-3 py-2 text-sm whitespace-pre-wrap"
                }
              >
                {text || (m.role === "assistant" && isLoading ? "…" : "")}
              </div>
            );
          })}
          {error && (
            <div className="mr-auto max-w-[90%] rounded-2xl bg-destructive/15 px-3 py-2 text-xs text-destructive">
              {error.message || "Something went wrong. Please try again."}
            </div>
          )}
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              disabled={isLoading}
              className="rounded-full border border-glass-border/60 bg-glass px-2.5 py-1 text-[11px] hover:bg-accent/20 disabled:opacity-50"
            >
              {s}
            </button>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="mt-3 flex items-center gap-2 rounded-full border border-glass-border/60 bg-glass pl-4 pr-1 py-1"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={listening ? "Listening…" : "Ask Aurora about your safety…"}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <button
            type="button"
            onClick={toggleMic}
            aria-label={listening ? "Stop listening" : "Start voice input"}
            className={
              "grid h-8 w-8 place-items-center rounded-full border border-glass-border/60 " +
              (listening ? "bg-destructive text-destructive-foreground animate-pulse" : "hover:bg-accent/20")
            }
          >
            {listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </button>
          {isLoading ? (
            <button
              type="button"
              onClick={() => stop()}
              aria-label="Stop"
              className="grid h-8 w-8 place-items-center rounded-full bg-muted text-foreground hover:opacity-90"
            >
              <Square className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="submit"
              aria-label="Send"
              disabled={!input.trim()}
              className="grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          )}
        </form>
      </div>
    </GlassCard>
  );
}
