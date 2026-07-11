import { MapPin, Mic, MicOff, Send, Sparkles, Square } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { toast } from "sonner";
import { GlassCard } from "../glass-card";
import { useLocation } from "../../lib/locations";
import { useSpeechRecognition } from "../../hooks/use-speech-recognition";
import { useSpeakOnce } from "../../hooks/use-speech-synthesis";
import { ChatBubble, messageText } from "./chat-bubble";

const SUGGESTIONS = [
  "Is it safe to travel today?",
  "What should I do about a flood warning here?",
  "Build me a 24-hour blackout checklist",
  "First-aid steps for heat exhaustion",
];

export function AIAssistant() {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const { active, locations } = useLocation();

  const initial = useMemo<UIMessage[]>(
    () => [
      {
        id: "welcome",
        role: "assistant",
        parts: [
          {
            type: "text",
            text: `I'm Mausam — your emergency assistant, tuned to ${active.name}${
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

  const { listening, toggle: toggleMic } = useSpeechRecognition({
    onTranscript: setInput,
    onFinal: send,
    onUnsupported: () =>
      toast.error("Voice input isn't supported in this browser.", {
        description: "Try Chrome or Edge for voice input.",
      }),
  });

  // Speak the latest assistant message when it finishes streaming.
  const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant");
  const shouldSpeak = !isLoading && lastAssistant?.id !== "welcome";
  useSpeakOnce({
    id: shouldSpeak ? lastAssistant?.id : null,
    text: lastAssistant ? messageText(lastAssistant) : "",
  });

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
                "Mausam is thinking…"
              ) : (
                <>
                  <MapPin className="h-3 w-3" /> {active.name} · Voice + text
                </>
              )}
            </div>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 space-y-2 overflow-y-auto pr-1 min-h-[160px] max-h-[260px]">
          {messages.map((m) => (
            <ChatBubble key={m.id} message={m} pending={isLoading} />
          ))}
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
            placeholder={listening ? "Listening…" : "Ask about preparedness or your checklist…"}
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
