import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// Reads a single Oracle credential from a pasted link and imports it as a
// digital badge/credential. Supports two kinds of links:
//   1. Credly badge links (Oracle issues its badges through Credly). We fetch
//      the badge's JSON and read the full metadata + badge image.
//   2. Any other Oracle link (e.g. CertView / catalog-education). We fetch the
//      page and extract Open Graph / title metadata as a best-effort fallback.

function levelFromText(text) {
  const raw = (text || "").toLowerCase();
  if (raw.includes("expert") || raw.includes("advanced")) return "Advanced";
  if (raw.includes("professional") || raw.includes("intermediate")) return "Intermediate";
  if (raw.includes("specialist") || raw.includes("specialty")) return "Specialist";
  return "Foundational";
}

function stripHtml(s) {
  return (s || "").replace(/<[^>]*>/g, "").trim();
}

function metaTag(html, property) {
  const patterns = [
    new RegExp(
      `<meta[^>]+(?:property|name)=["']${property}["'][^>]*content=["']([^"']+)["']`,
      "i"
    ),
    new RegExp(
      `<meta[^>]+content=["']([^"']+)["'][^>]*(?:property|name)=["']${property}["']`,
      "i"
    ),
  ];
  for (const re of patterns) {
    const m = html.match(re);
    if (m) return m[1];
  }
  return "";
}

async function fromCredlyBadge(badgeId) {
  const res = await fetch(
    `https://www.credly.com/badges/${encodeURIComponent(badgeId)}.json`,
    { headers: { Accept: "application/json", "User-Agent": "Mozilla/5.0" } }
  );
  if (!res.ok) return null;
  const json = await res.json();
  const item = json?.data || json;
  const t = item?.badge_template || {};
  const issuerEntities = item?.issuer?.entities;
  const issuer =
    (Array.isArray(issuerEntities) && issuerEntities[0]?.entity?.name) ||
    t?.issuer?.name ||
    "Oracle";
  return {
    title: t?.name || "Oracle Credential",
    issuer,
    provider: "Oracle University",
    issue_date: item?.issued_at_date || item?.issued_at || null,
    expiration_date: item?.expires_at_date || item?.expires_at || null,
    credential_id: item?.id || badgeId,
    verification_url: `https://www.credly.com/badges/${item?.id || badgeId}`,
    badge_image: t?.image_url || t?.image?.url || "",
    skills: Array.isArray(t?.skills) ? t.skills.map((s) => s.name).filter(Boolean) : [],
    level: levelFromText(t?.level),
    tags: ["Oracle", "Oracle University"],
    description: stripHtml(t?.description),
    source: "oracle-link",
    verified: true,
  };
}

async function fromGenericPage(url) {
  const res = await fetch(url, {
    headers: { Accept: "text/html", "User-Agent": "Mozilla/5.0" },
  });
  if (!res.ok) return null;
  const html = await res.text();
  const title =
    metaTag(html, "og:title") ||
    (html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1] ?? "").trim() ||
    "Oracle Credential";
  const description =
    metaTag(html, "og:description") || metaTag(html, "description") || "";
  const image = metaTag(html, "og:image");
  return {
    title: stripHtml(title),
    issuer: "Oracle",
    provider: "Oracle University",
    issue_date: null,
    expiration_date: null,
    credential_id: "",
    verification_url: url,
    badge_image: image || "",
    skills: [],
    level: levelFromText(`${title} ${description}`),
    tags: ["Oracle", "Oracle University"],
    description: stripHtml(description),
    source: "oracle-link",
    verified: false,
  };
}

export async function POST(request) {
  const supabase = await createClient();
  let url = "";
  try {
    const body = await request.json();
    url = (body.url || "").trim();
  } catch {}

  if (!url) {
    return NextResponse.json(
      { error: "Paste an Oracle credential link to import." },
      { status: 400 }
    );
  }
  if (!/^https?:\/\//i.test(url)) url = `https://${url}`;

  let row = null;
  try {
    // Credly badge link (Oracle badges are hosted on Credly)
    const credlyMatch = url.match(/credly\.com\/badges\/([^/?#]+)/i);
    if (credlyMatch) {
      row = await fromCredlyBadge(credlyMatch[1]);
    }
    if (!row) {
      row = await fromGenericPage(url);
    }
  } catch (e) {
    console.log("[v0] Oracle link import error:", e?.message);
  }

  if (!row) {
    return NextResponse.json(
      {
        error:
          "Could not read that link. Make sure it is a public Oracle or Credly badge URL.",
      },
      { status: 502 }
    );
  }

  const { error } = await supabase
    .from("credentials")
    .upsert(row, { onConflict: "provider,credential_id" });
  if (error) {
    return NextResponse.json(
      { error: "Failed to save the credential. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, credential: row });
}
