import { describe, expect, it } from "vitest";
import { ChatBodySchema } from "../../src/lib/chat-validation";

describe("ChatBodySchema", () => {
  it("accepts a minimal valid body", () => {
    const parsed = ChatBodySchema.parse({
      messages: [{ id: "1", role: "user", parts: [{ type: "text", text: "hi" }] }],
    });
    expect(parsed.messages).toHaveLength(1);
  });

  it("rejects missing messages", () => {
    expect(() => ChatBodySchema.parse({})).toThrow();
  });

  it("rejects >50 messages", () => {
    const msgs = Array.from({ length: 51 }, (_, i) => ({
      id: String(i),
      role: "user" as const,
      parts: [{ type: "text" as const, text: "hi" }],
    }));
    expect(() => ChatBodySchema.parse({ messages: msgs })).toThrow();
  });

  it("rejects oversized text (>4000 chars)", () => {
    const long = "x".repeat(4001);
    expect(() =>
      ChatBodySchema.parse({
        messages: [{ id: "1", role: "user", parts: [{ type: "text", text: long }] }],
      }),
    ).toThrow();
  });

  it("caps location string lengths", () => {
    expect(() =>
      ChatBodySchema.parse({
        messages: [{ id: "1", role: "user", parts: [{ type: "text", text: "hi" }] }],
        location: { name: "x".repeat(300) },
      }),
    ).toThrow();
  });
});
