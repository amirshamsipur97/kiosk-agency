import { getKnowledgeBase, saveLead } from "@/lib/architect";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MODEL = process.env.ARCHITECT_MODEL || "claude-sonnet-4-5";

type ChatMessage = { role: "user" | "assistant"; content: string };

// Structured recommendation the AI emits via tool use.
const RECOMMENDATION_TOOL = {
  name: "present_recommendation",
  description:
    "Present the final structured growth recommendation to the client. Only call this once you have gathered enough about their business (industry, stage, main goal, challenges, budget). Use ONLY service/product/package slugs that exist in the knowledge base.",
  input_schema: {
    type: "object",
    additionalProperties: false,
    properties: {
      business_name: { type: "string" },
      industry: { type: "string" },
      business_stage: { type: "string" },
      main_goal: { type: "string" },
      challenges: { type: "array", items: { type: "string" } },
      budget_range: { type: "string" },
      summary_message: {
        type: "string",
        description: "A short, warm executive message to show above the recommendation cards.",
      },
      scores: {
        type: "object",
        additionalProperties: false,
        properties: {
          business_maturity: { type: "number" },
          digital_readiness: { type: "number" },
          growth_potential: { type: "number" },
          automation_readiness: { type: "number" },
        },
        required: [
          "business_maturity",
          "digital_readiness",
          "growth_potential",
          "automation_readiness",
        ],
      },
      recommended_services: {
        type: "array",
        items: { type: "string" },
        description: "service slugs from the knowledge base, ranked by relevance",
      },
      recommended_ai_products: {
        type: "array",
        items: { type: "string" },
        description: "ai_product slugs from the knowledge base, ranked by relevance",
      },
      recommended_package: {
        type: "string",
        description: "a single package slug from the knowledge base",
      },
      growth_roadmap: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            phase: { type: "string" },
            title: { type: "string" },
            timeline: { type: "string" },
            priority: { type: "string" },
            items: { type: "array", items: { type: "string" } },
            expected_outcomes: { type: "array", items: { type: "string" } },
          },
          required: ["phase", "title", "timeline", "items"],
        },
      },
      executive_summary: { type: "string" },
      proposal: {
        type: "object",
        additionalProperties: false,
        properties: {
          overview: { type: "string" },
          timeline: { type: "string" },
          budget_range: { type: "string" },
          next_steps: { type: "array", items: { type: "string" } },
        },
        required: ["overview", "next_steps"],
      },
    },
    required: [
      "summary_message",
      "scores",
      "recommended_services",
      "recommended_ai_products",
      "recommended_package",
      "growth_roadmap",
      "executive_summary",
      "proposal",
    ],
  },
} as const;

function buildSystem(kb: Awaited<ReturnType<typeof getKnowledgeBase>>) {
  return `You are the Lead Solutions Architect for KIOSK Agency — an AI-Native Growth Infrastructure Company.

PHILOSOPHY: "We don't sell services. We build connected growth systems." KIOSK helps businesses attract, engage, convert, automate, and scale.

YOUR ROLE: Act as a senior growth consultant, solutions architect, and digital-transformation advisor. Run a focused consultation, then deliver a tailored growth recommendation.

TONE: Premium, executive, strategic, data-driven, professional, GCC-friendly (Real Estate, Automotive, Hospitality, Healthcare, Corporate).

CONVERSATION FLOW:
1. Ask SHORT focused questions to learn: main goal, current challenges, and rough budget/stage. Ask ONE question per turn. Keep it tight.
2. ALWAYS ask at least ONE question about their main goal and biggest challenge before recommending — UNLESS the user has already stated both a goal and a challenge, in which case recommend immediately.
3. BE DECISIVE. Once you know the industry + main goal + at least one challenge, call present_recommendation. Ask a MAXIMUM of TWO questions total — never a third.
4. NEVER repeat a question the user already answered. Read the full conversation; if the info is already there, recommend now instead of asking again.

RESPONSE FORMATTING (very important — the reader must never feel lost):
- ALWAYS structure replies so they are scannable. Group content under short bold mini-headings using markdown like "**Heading**" on their own line.
- Use "- " bullet points for lists (one idea per bullet). Avoid long paragraphs.
- A good shape: a 1-line summary, then 1-3 labelled sections with bullets, then ONE clear question or next step at the end.
- Keep it tight and executive. No walls of text.

HARD RULES:
- NEVER invent services, AI products, or packages. ONLY use slugs that appear in the KNOWLEDGE BASE below.
- recommended_services / recommended_ai_products / recommended_package / growth_roadmap items must reference real KB slugs (services/products) or their titles.
- Always prioritize: business outcomes, lead generation, conversion, automation, scalability, revenue growth, operational efficiency.
- Scores are 0-100 estimates based on what the client tells you.
- Recommend exactly one package slug that best fits their stage + budget.

KNOWLEDGE BASE (JSON):
SERVICES: ${JSON.stringify(kb.services.map((s) => ({ slug: s.slug, title: s.title, category: s.category, outcome: s.outcome, budget: s.budget_level, package: s.package_level })))}
AI_PRODUCTS: ${JSON.stringify(kb.aiProducts.map((p) => ({ slug: p.slug, title: p.title, problem: p.problem_solved, budget: p.budget_level })))}
PACKAGES: ${JSON.stringify(kb.packages.map((p) => ({ slug: p.slug, name: p.package_name, ideal: p.ideal_client, budget: p.budget_level })))}
INDUSTRIES: ${JSON.stringify(kb.industries.map((i) => ({ slug: i.slug, name: i.industry_name, challenges: i.common_challenges, services: i.recommended_services, products: i.recommended_ai_products, packages: i.recommended_packages })))}
CHALLENGES: ${JSON.stringify(kb.challenges.map((c) => ({ slug: c.slug, challenge: c.challenge, services: c.recommended_services, products: c.recommended_ai_products })))}`;
}

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "AI is not configured yet. Set ANTHROPIC_API_KEY." },
      { status: 503 },
    );
  }

  let body: { messages?: ChatMessage[]; industry?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const messages = (body.messages || []).filter(
    (m) => m && (m.role === "user" || m.role === "assistant") && m.content,
  );
  if (messages.length === 0) {
    return Response.json({ error: "No messages." }, { status: 400 });
  }

  const industry = (body.industry || "").trim();
  const kb = await getKnowledgeBase();
  let system = buildSystem(kb);
  if (industry && industry.toLowerCase() !== "all") {
    system += `\n\nACTIVE INDUSTRY FOCUS: The user is consulting specifically about the **${industry}** industry. Tailor every answer, recommendation, and the executive summary to ${industry}. Lean on the matching industry entry in the KB.`;
  } else {
    system += `\n\nACTIVE INDUSTRY FOCUS: General ("All") — the user has not narrowed to one industry. Give broad, cross-industry guidance and, if their question clearly implies an industry, focus there.`;
  }

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 2048,
        system: [
          { type: "text", text: system, cache_control: { type: "ephemeral" } },
        ],
        tools: [RECOMMENDATION_TOOL],
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      return Response.json(
        { error: "AI request failed.", detail: detail.slice(0, 400) },
        { status: 502 },
      );
    }

    const data = await res.json();
    const blocks: Array<{ type: string; text?: string; name?: string; input?: unknown }> =
      data.content || [];

    const textReply = blocks
      .filter((b) => b.type === "text")
      .map((b) => b.text || "")
      .join("\n")
      .trim();

    const toolBlock = blocks.find(
      (b) => b.type === "tool_use" && b.name === "present_recommendation",
    );

    if (toolBlock?.input) {
      const rec = toolBlock.input as Record<string, unknown>;
      // Persist the lead. Must await — serverless freezes after the response is
      // returned, so a fire-and-forget insert would be killed mid-flight.
      // saveLead swallows its own errors and returns a boolean.
      await saveLead({
        business_name: rec.business_name as string,
        industry: rec.industry as string,
        business_stage: rec.business_stage as string,
        main_goal: rec.main_goal as string,
        challenges: rec.challenges as string[],
        budget_range: rec.budget_range as string,
        message: (rec.summary_message as string) || "",
        recommended_services: rec.recommended_services as string[],
        recommended_ai_products: rec.recommended_ai_products as string[],
        recommended_package: rec.recommended_package as string,
        growth_roadmap: rec.growth_roadmap,
        executive_summary: rec.executive_summary as string,
        scores: rec.scores,
        conversation: messages,
      });

      return Response.json({
        reply: (rec.summary_message as string) || textReply,
        recommendation: rec,
      });
    }

    return Response.json({ reply: textReply || "Could you tell me a bit more about your business?" });
  } catch {
    return Response.json({ error: "AI request failed." }, { status: 502 });
  }
}
