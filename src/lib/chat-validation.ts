import { z } from "zod";

// Validation for /api/chat request bodies. Guards against oversized prompts,
// message-bomb attacks, and unbounded location strings. Shared with tests.

const MessagePart = z.object({
  type: z.string().max(32),
  text: z.string().max(4000).optional(),
});

const Message = z.object({
  id: z.string().max(128),
  role: z.enum(["user", "assistant", "system"]),
  parts: z.array(MessagePart).max(16),
});

const Location = z.object({
  name: z.string().trim().max(120).optional(),
  region: z.string().trim().max(120).optional(),
  country: z.string().trim().max(120).optional(),
  lat: z.number().min(-90).max(90).optional(),
  lon: z.number().min(-180).max(180).optional(),
  label: z.string().trim().max(80).optional(),
  savedLocations: z
    .array(
      z.object({
        name: z.string().trim().max(120),
        region: z.string().trim().max(120).optional(),
        label: z.string().trim().max(80).optional(),
      }),
    )
    .max(20)
    .optional(),
}).optional();

export const ChatBodySchema = z.object({
  messages: z.array(Message).min(1).max(50),
  location: Location,
});

export type ChatBody = z.infer<typeof ChatBodySchema>;
