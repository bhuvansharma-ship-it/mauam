import type { UIMessage } from "ai";

const USER_CLS =
  "ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-primary/20 px-3 py-2 text-sm whitespace-pre-wrap";
const ASSISTANT_CLS =
  "mr-auto max-w-[85%] rounded-2xl rounded-tl-sm bg-muted/60 px-3 py-2 text-sm whitespace-pre-wrap";

export function messageText(m: UIMessage): string {
  return m.parts.map((p) => (p.type === "text" ? p.text : "")).join("");
}

export function ChatBubble({ message, pending }: { message: UIMessage; pending: boolean }) {
  const text = messageText(message);
  const placeholder = message.role === "assistant" && pending ? "…" : "";
  return <div className={message.role === "user" ? USER_CLS : ASSISTANT_CLS}>{text || placeholder}</div>;
}
