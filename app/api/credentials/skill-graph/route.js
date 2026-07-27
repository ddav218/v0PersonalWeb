import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { generateObject } from "ai";
import { z } from "zod";

const GRAPH_KEY = "skill_graph";

const graphSchema = z.object({
  summary: z
    .string()
    .describe(
      "A confident 2-3 sentence professional summary of this person as an Oracle Middleware developer focused on Integrations, grounded in the credentials provided."
    ),
  domains: z
    .array(
      z.object({
        name: z.string().describe("Skill domain name, e.g. 'Integration & Middleware'"),
        score: z.number().min(0).max(100).describe("Aggregate proficiency 0-100 for this domain"),
        skills: z.array(z.string()).describe("Representative skills within this domain"),
        credentialCount: z.number().describe("How many credentials contributed to this domain"),
      })
    )
    .min(4)
    .max(7)
    .describe("Between 4 and 7 skill domains, ordered by strength descending"),
});

export async function GET() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("app_settings")
    .select("value")
    .eq("key", GRAPH_KEY)
    .maybeSingle();

  if (!data?.value) {
    return NextResponse.json({ summary: "", domains: [], generatedAt: null });
  }
  try {
    return NextResponse.json(JSON.parse(data.value));
  } catch {
    return NextResponse.json({ summary: "", domains: [], generatedAt: null });
  }
}

export async function POST() {
  const supabase = await createClient();
  const { data: creds, error } = await supabase.from("credentials").select("*");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!creds || creds.length === 0) {
    return NextResponse.json(
      { error: "No credentials to analyze yet. Discover or add credentials first." },
      { status: 400 }
    );
  }

  const summarized = creds.map((c) => ({
    title: c.title,
    issuer: c.issuer,
    provider: c.provider,
    level: c.level,
    skills: c.skills || [],
    tags: c.tags || [],
  }));

  try {
    const { object } = await generateObject({
      model: "openai/gpt-4.1-mini",
      schema: graphSchema,
      prompt: `Analyze the following professional digital credentials for an Oracle Middleware developer specializing in Integrations.
Cluster the skills into 4-7 coherent skill domains (e.g. "Integration & Middleware", "Cloud & Infrastructure", "Data & Analytics", "Security & Governance", "Professional & Leadership", "AI & Automation"). 
For each domain, compute an aggregate proficiency score (0-100) reflecting the number of credentials, their levels (Foundational < Intermediate < Advanced < Specialist), and relevance. Weight Integration/Middleware highest when supported by the data.
Also write a professional summary. Ground everything strictly in the provided credentials.

CREDENTIALS JSON:
${JSON.stringify(summarized, null, 2)}`,
    });

    const payload = { ...object, generatedAt: new Date().toISOString() };

    await supabase
      .from("app_settings")
      .upsert(
        { key: GRAPH_KEY, value: JSON.stringify(payload), updated_at: new Date().toISOString() },
        { onConflict: "key" }
      );

    return NextResponse.json(payload);
  } catch (e) {
    console.log("[v0] skill-graph error:", e?.message);
    return NextResponse.json({ error: "AI analysis failed. Try again." }, { status: 500 });
  }
}
