import { createFileRoute } from "@tanstack/react-router";

// POST { text: string, lang?: string, voice?: string }
// Returns audio/mpeg bytes. Uses Lovable AI TTS (OpenAI gpt-4o-mini-tts).
export const Route = createFileRoute("/api/tts")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = process.env.LOVABLE_API_KEY;
        if (!apiKey) return new Response("TTS not configured", { status: 503 });

        let body: { text?: string; voice?: string; instructions?: string };
        try {
          body = await request.json();
        } catch {
          return new Response("Bad JSON", { status: 400 });
        }
        const text = (body.text ?? "").toString().trim();
        if (!text) return new Response("Missing text", { status: 400 });
        if (text.length > 4000) {
          return new Response("Text too long (max 4000 chars)", { status: 400 });
        }
        const voice = (body.voice ?? "alloy").toString();
        const instructions = body.instructions?.toString();

        try {
          const res = await fetch("https://ai.gateway.lovable.dev/v1/audio/speech", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "openai/gpt-4o-mini-tts",
              input: text,
              voice,
              instructions,
              response_format: "mp3",
              stream_format: "audio",
            }),
          });
          if (!res.ok) {
            const errText = await res.text().catch(() => "");
            return new Response(errText || "TTS upstream failed", { status: res.status });
          }
          return new Response(res.body, {
            headers: {
              "Content-Type": "audio/mpeg",
              "Cache-Control": "no-store",
            },
          });
        } catch (err) {
          return new Response(err instanceof Error ? err.message : "TTS error", { status: 500 });
        }
      },
    },
  },
});
