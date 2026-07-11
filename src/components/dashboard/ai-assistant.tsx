import { Send, Sparkles } from "lucide-react";
import { useState } from "react";
import { GlassCard } from "../glass-card";

const SEED = [
  { role: "assistant", text: "I'm here to help you stay safe. Ask about the current flood warning, your checklist, or the safest route home." },
];
const SUGGESTIONS = [
  "What should I do about the flood warning?",
  "Am I ready if power goes out tonight?",
  "Safest route from downtown to home?",
];

export function AIAssistant() {
  const [messages, setMessages] = useState(SEED);
  const [input, setInput] = useState("");

  const send = (text: string) => {
    if (!text.trim()) return;
    setMessages((m) => [...m, { role: "user", text }, { role: "assistant", text: mockReply(text) }]);
    setInput("");
  };

  return (
    <GlassCard className="col-span-12 lg:col-span-4" glow="primary">
      <div className="flex h-full flex-col p-5 sm:p-6">
        <div className="mb-3 flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-primary to-accent">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-display text-base font-semibold">AI Emergency Assistant</h3>
            <div className="text-[11px] text-muted-foreground">Powered by local guidance</div>
          </div>
        </div>
        <div className="flex-1 space-y-2 overflow-y-auto pr-1 min-h-[140px] max-h-[220px]">
          {messages.map((m, i) => (
            <div key={i} className={m.role === "user" ? "ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-primary/20 px-3 py-2 text-sm" : "mr-auto max-w-[85%] rounded-2xl rounded-tl-sm bg-muted/60 px-3 py-2 text-sm"}>
              {m.text}
            </div>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {SUGGESTIONS.map((s) => (
            <button key={s} onClick={() => send(s)} className="rounded-full border border-glass-border/60 bg-glass px-2.5 py-1 text-[11px] hover:bg-accent/20">{s}</button>
          ))}
        </div>
        <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="mt-3 flex items-center gap-2 rounded-full border border-glass-border/60 bg-glass pl-4 pr-1 py-1">
          <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about your safety…" className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
          <button aria-label="Send" className="grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground hover:opacity-90"><Send className="h-4 w-4" /></button>
        </form>
      </div>
    </GlassCard>
  );
}

function mockReply(q: string) {
  const lower = q.toLowerCase();
  if (lower.includes("flood")) return "The Coastal Flood Warning is active through 8 PM. Avoid Embarcadero and Marina Blvd. If you live in Zone A, move your vehicle uphill and pack a go-bag.";
  if (lower.includes("power") || lower.includes("outage")) return "Charge devices now, refill any medications, and locate flashlights. Your checklist is 70% complete — I recommend prioritizing the portable power bank and printed contact list.";
  if (lower.includes("route")) return "I-280 southbound is currently the safest route home. Highway 101 has flooding near Sierra Point. Estimated travel time via I-280: 34 minutes.";
  return "I can help with alerts, evacuation routes, checklist priorities, and shelter locations. What's on your mind?";
}
