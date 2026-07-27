import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// Normalize a DB row (snake_case) to the frontend shape (camelCase)
function normalize(row) {
  return {
    id: row.id,
    title: row.title,
    issuer: row.issuer,
    provider: row.provider,
    issueDate: row.issue_date,
    expirationDate: row.expiration_date,
    credentialId: row.credential_id,
    verificationUrl: row.verification_url,
    badgeImage: row.badge_image,
    skills: row.skills || [],
    level: row.level,
    tags: row.tags || [],
    description: row.description,
    source: row.source,
    verified: row.verified,
    createdAt: row.created_at,
  };
}

// Map an incoming credential body to DB columns
function toRow(body) {
  return {
    title: body.title,
    issuer: body.issuer || "",
    provider: body.provider || "Credly",
    issue_date: body.issueDate || null,
    expiration_date: body.expirationDate || null,
    credential_id: body.credentialId || "",
    verification_url: body.verificationUrl || "",
    badge_image: body.badgeImage || "",
    skills: Array.isArray(body.skills) ? body.skills : [],
    level: body.level || "Foundational",
    tags: Array.isArray(body.tags) ? body.tags : [],
    description: body.description || "",
    source: body.source || "manual",
    verified: body.verified !== undefined ? body.verified : true,
  };
}

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("credentials")
    .select("*")
    .order("issue_date", { ascending: false, nullsFirst: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data.map(normalize));
}

export async function POST(request) {
  const supabase = await createClient();
  const body = await request.json();

  const { data, error } = await supabase
    .from("credentials")
    .insert(toRow(body))
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(normalize(data));
}

export async function PUT(request) {
  const supabase = await createClient();
  const body = await request.json();

  const { data, error } = await supabase
    .from("credentials")
    .update(toRow(body))
    .eq("id", body.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(normalize(data));
}

export async function DELETE(request) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  const { error } = await supabase.from("credentials").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
