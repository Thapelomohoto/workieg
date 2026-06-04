import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";
const DEFAULT_MODEL = "google/gemini-3-flash-preview";

async function callAI(messages: Array<{ role: string; content: string }>) {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) throw new Error("LOVABLE_API_KEY is not configured");

  const res = await fetch(GATEWAY_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ model: DEFAULT_MODEL, messages }),
  });

  if (!res.ok) {
    if (res.status === 429) throw new Error("Rate limit exceeded. Please try again in a moment.");
    if (res.status === 402) throw new Error("AI credits exhausted. Please add credits to your workspace.");
    const t = await res.text();
    console.error("AI gateway error:", res.status, t);
    throw new Error("AI service error. Please try again.");
  }

  const data = await res.json();
  return (data.choices?.[0]?.message?.content as string) ?? "";
}

const EmailSchema = z.object({
  recipient: z.string().min(1).max(200),
  topic: z.string().min(1).max(2000),
  tone: z.enum(["Professional", "Friendly", "Persuasive", "Concise", "Formal", "Casual"]),
  audience: z.enum(["Client", "Manager", "Colleague", "Executive", "Vendor", "Team"]),
});

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => EmailSchema.parse(input))
  .handler(async ({ data }) => {
    const system = `You are an expert business writer. Generate a polished email with these requirements:
- Tone: ${data.tone}
- Audience: ${data.audience}
- Include a clear subject line on the first line prefixed with "Subject: "
- Use proper greeting and signoff
- Keep it well-structured and concise (under 200 words unless complexity demands more)
- Return ONLY the email text, no commentary`;
    const user = `Recipient: ${data.recipient}\nTopic / context:\n${data.topic}`;
    const content = await callAI([
      { role: "system", content: system },
      { role: "user", content: user },
    ]);
    return { content };
  });

const NotesSchema = z.object({
  notes: z.string().min(10).max(20000),
});

export const summarizeMeeting = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => NotesSchema.parse(input))
  .handler(async ({ data }) => {
    const system = `You are an expert meeting analyst. Given raw meeting notes or a transcript, produce a structured markdown summary with EXACTLY these sections:

## Summary
2-3 sentence executive overview.

## Key Points
- Bulleted key discussion points.

## Action Items
- [Owner] Action — Deadline (if specified, otherwise "TBD")

## Decisions Made
- Bulleted decisions.

## Open Questions
- Bulleted open items.

Be precise. If a section has no items, write "None identified."`;
    const content = await callAI([
      { role: "system", content: system },
      { role: "user", content: data.notes },
    ]);
    return { content };
  });

const PlannerSchema = z.object({
  tasks: z.string().min(5).max(10000),
  timeframe: z.string().min(1).max(100),
});

export const planTasks = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => PlannerSchema.parse(input))
  .handler(async ({ data }) => {
    const system = `You are an expert productivity coach using the Eisenhower Matrix and time-blocking. Given a list of tasks and a timeframe, produce a structured markdown plan:

## Prioritized Tasks
A numbered list. For each task include: **Title** — Priority (P1/P2/P3) — Estimated time — Suggested time block.

## Schedule (${"${timeframe placeholder}"})
A markdown table or bulleted schedule mapping tasks to time slots.

## Recommendations
2-4 bullets with productivity tips specific to this workload.

Be realistic about time and call out anything that looks overcommitted.`;
    const user = `Timeframe: ${data.timeframe}\n\nTasks:\n${data.tasks}`;
    const content = await callAI([
      { role: "system", content: system },
      { role: "user", content: user },
    ]);
    return { content };
  });

const ResearchSchema = z.object({
  topic: z.string().min(2).max(500),
  depth: z.enum(["Brief", "Standard", "Deep"]),
});

export const researchTopic = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ResearchSchema.parse(input))
  .handler(async ({ data }) => {
    const lenHint =
      data.depth === "Brief" ? "~200 words" : data.depth === "Standard" ? "~450 words" : "~800 words";
    const system = `You are a senior research analyst. Produce a structured markdown research brief (${lenHint}) with these sections:

## Overview
## Key Insights
(bulleted, 4-6 insights)
## Trends & Context
## Considerations & Risks
## Suggested Next Steps

Base content on widely-known information. Be clear when something is opinion vs fact. Do not fabricate statistics or citations.`;
    const content = await callAI([
      { role: "system", content: system },
      { role: "user", content: `Research topic: ${data.topic}` },
    ]);
    return { content };
  });

const ChatSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(8000),
      })
    )
    .min(1)
    .max(40),
});

export const chat = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ChatSchema.parse(input))
  .handler(async ({ data }) => {
    const system = `You are a helpful AI workplace productivity assistant. Help professionals with writing, planning, research, summarization, and general work tasks. Be concise, structured, and practical. Use markdown formatting when helpful.`;
    const content = await callAI([
      { role: "system", content: system },
      ...data.messages,
    ]);
    return { content };
  });
