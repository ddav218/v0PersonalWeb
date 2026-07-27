import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// Pulls a public Credly profile's badges and upserts them as credentials.
// Credly exposes a public JSON endpoint for public profiles.
function pickIssuer(item) {
  try {
    const entities = item?.issuer?.entities;
    if (Array.isArray(entities) && entities.length) {
      return entities[0]?.entity?.name || "";
    }
  } catch {}
  return item?.badge_template?.issuer?.name || "";
}

function levelFromTemplate(t) {
  const raw = (t?.level || "").toString().toLowerCase();
  if (raw.includes("expert") || raw.includes("advanced")) return "Advanced";
  if (raw.includes("intermediate") || raw.includes("professional")) return "Intermediate";
  if (raw.includes("specialty") || raw.includes("specialist")) return "Specialist";
  return "Foundational";
}

export async function POST(request) {
  const supabase = await createClient();
  let username = "";
  try {
    const body = await request.json();
    username = (body.username || "").trim();
  } catch {}

  // Fall back to the stored setting
  if (!username) {
    const { data: setting } = await supabase
      .from("app_settings")
      .select("value")
      .eq("key", "credly_username")
      .maybeSingle();
    username = (setting?.value || "").trim();
  }

  // Accept a full URL or a bare username
  const match = username.match(/credly\.com\/users\/([^/?#]+)/i);
  if (match) username = match[1];

  if (!username) {
    return NextResponse.json(
      { error: "No Credly username configured. Add it in the admin Credentials settings." },
      { status: 400 }
    );
  }

  let badges = [];
  try {
    const res = await fetch(
      `https://www.credly.com/users/${encodeURIComponent(username)}/badges.json`,
      { headers: { Accept: "application/json", "User-Agent": "Mozilla/5.0" } }
    );
    if (!res.ok) {
      return NextResponse.json(
        {
          error: `Credly returned ${res.status}. Make sure the profile "${username}" exists and is public.`,
        },
        { status: 502 }
      );
    }
    const json = await res.json();
    badges = json?.data || [];
  } catch (e) {
    return NextResponse.json(
      { error: "Could not reach Credly. Try again shortly." },
      { status: 502 }
    );
  }

  let imported = 0;
  const results = [];
  for (const item of badges) {
    const t = item?.badge_template || {};
    const credentialId = item?.id || t?.id || "";
    const row = {
      title: t?.name || "Untitled Badge",
      issuer: pickIssuer(item) || "Credly",
      provider: "Credly",
      issue_date: item?.issued_at_date || item?.issued_at || null,
      expiration_date: item?.expires_at_date || item?.expires_at || null,
      credential_id: credentialId,
      verification_url: credentialId ? `https://www.credly.com/badges/${credentialId}` : (t?.url || ""),
      badge_image: t?.image_url || t?.image?.url || "",
      skills: Array.isArray(t?.skills) ? t.skills.map((s) => s.name).filter(Boolean) : [],
      level: levelFromTemplate(t),
      tags: ["Credly"],
      description: (t?.description || "").replace(/<[^>]*>/g, "").trim(),
      source: "credly",
      verified: true,
    };
    const { error } = await supabase
      .from("credentials")
      .upsert(row, { onConflict: "provider,credential_id" });
    if (!error) {
      imported += 1;
      results.push(row.title);
    }
  }

  return NextResponse.json({
    success: true,
    username,
    imported,
    total: badges.length,
    titles: results,
  });
}
