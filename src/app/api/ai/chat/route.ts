import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import Anthropic from "@anthropic-ai/sdk";
import { supabase } from "@/lib/supabase";

if (!process.env.ANTHROPIC_API_KEY) {
  console.warn("ANTHROPIC_API_KEY is not set — AI chat will use fallback responses.");
}

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const message = typeof body.message === "string" ? body.message.slice(0, 2000) : null;
    if (!message) return NextResponse.json({ error: "Message required" }, { status: 400 });

    // Cap history to the last 20 turns to prevent token exhaustion
    const rawHistory: Array<{ role: string; content: string }> = Array.isArray(body.history)
      ? body.history.slice(-20)
      : [];
    const history = rawHistory.map((h) => ({
      role: typeof h.role === "string" ? h.role : "user",
      content: typeof h.content === "string" ? h.content.slice(0, 2000) : "",
    }));

    // Get CRM context
    type DealSnippet = { stage: string; value: number; title: string };
    const [contactsRes, rawDealsRes, rawTasksRes] = await Promise.all([
      supabase.from("contacts").select("*", { count: "exact", head: true }),
      supabase.from("deals").select("title, stage, value").limit(10),
      supabase.from("tasks").select("id").neq("status", "completed").limit(5),
    ]);

    const contacts = contactsRes.count ?? 0;
    const deals: DealSnippet[] = rawDealsRes.data ?? [];
    const tasks = rawTasksRes.data ?? [];

    const crmContext = `
You are an AI assistant for Ese Connect CRM. Here is the current CRM data summary:
- Total contacts: ${contacts}
- Recent deals: ${deals.map((d) => `${d.title} (${d.stage}, $${d.value})`).join(", ")}
- Pending tasks: ${tasks.length}

Help the user with CRM-related questions, email drafts, deal analysis, lead scoring explanations, and sales insights.
Be concise, professional, and actionable. Format responses with markdown when helpful.
    `.trim();

    const messages: Anthropic.Messages.MessageParam[] = [
      ...(history || []).map((h: { role: string; content: string }) => ({
        role: h.role as "user" | "assistant",
        content: h.content,
      })),
      { role: "user" as const, content: message },
    ];

    const response = await anthropic.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 1024,
      system: crmContext,
      messages,
    });

    const reply = response.content[0].type === "text" ? response.content[0].text : "";
    return NextResponse.json({ reply });
  } catch (error) {
    console.error("AI chat error:", error);
    // Return a helpful fallback if API key not configured
    return NextResponse.json({
      reply: "I'm the Ese Connect AI assistant. To enable AI features, please configure your Anthropic API key in the environment settings. In the meantime, I can help you navigate the CRM - try checking the Dashboard for an overview, or visit the Pipeline to manage your deals.",
    });
  }
}
