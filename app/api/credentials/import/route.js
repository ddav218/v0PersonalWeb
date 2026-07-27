import { NextResponse } from "next/server";
import { generateObject } from "ai";
import { z } from "zod";

const credentialSchema = z.object({
  title: z.string().describe("The full name/title of the credential or certification"),
  issuer: z.string().describe("The organization that issued the credential"),
  provider: z
    .enum(["Credly", "IBM SkillsBuild", "Oracle University", "Udemy", "Harvard Manage Mentor", "Other"])
    .describe("The platform the credential was earned on"),
  issueDate: z.string().describe("Issue date in YYYY-MM-DD format, or empty string if unknown"),
  expirationDate: z.string().describe("Expiration date in YYYY-MM-DD format, or empty string if none"),
  credentialId: z.string().describe("The credential/certificate ID if present, else empty string"),
  verificationUrl: z.string().describe("The verification URL if present, else empty string"),
  badgeImage: z.string().describe("A badge/certificate image URL if present, else empty string"),
  skills: z.array(z.string()).describe("List of skills demonstrated by this credential"),
  level: z
    .enum(["Foundational", "Intermediate", "Advanced", "Specialist"])
    .describe("The difficulty/mastery level"),
  tags: z.array(z.string()).describe("Short topic tags, e.g. Integration, Cloud, Middleware"),
  description: z.string().describe("A concise 1-2 sentence summary of the credential"),
});

export async function POST(request) {
  if (!process.env.AI_GATEWAY_API_KEY && !process.env.VERCEL_OIDC_TOKEN) {
    // AI Gateway is available zero-config on Vercel, but guard for local misconfig.
  }

  let text = "";
  let provider = "";
  try {
    const body = await request.json();
    text = (body.text || "").trim();
    provider = (body.provider || "").trim();
  } catch {}

  if (!text) {
    return NextResponse.json({ error: "Paste some credential text to import." }, { status: 400 });
  }

  try {
    const { object } = await generateObject({
      model: "openai/gpt-4.1-mini",
      schema: credentialSchema,
      prompt: `You are a credential extraction assistant for an Oracle Middleware / Integrations developer's portfolio.
Extract a single structured digital credential from the text below. Infer sensible skills and topic tags even if not explicitly listed, based on the credential title and issuer. Prefer concise, professional skill names.
${provider ? `The user indicates this credential is from: ${provider}.` : ""}
Use empty strings for unknown fields and never invent URLs or IDs that are not present in the text.

TEXT:
"""
${text}
"""`,
    });

    return NextResponse.json({ success: true, credential: { ...object, source: "ai-import", verified: false } });
  } catch (e) {
    console.log("[v0] AI import error:", e?.message);
    return NextResponse.json(
      { error: "AI extraction failed. Please check your input or try again." },
      { status: 500 }
    );
  }
}
