import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

const CATEGORIES = ["billable", "non-billable"];

function toClient(row) {
  return {
    id: row.id,
    category: row.category,
    client: row.client || "",
    title: row.title,
    role: row.role || "",
    description: row.description || "",
    image: row.image || "",
    tags: Array.isArray(row.tags) ? row.tags : [],
    liveUrl: row.live_url || "",
    repoUrl: row.repo_url || "",
    startDate: row.start_date || "",
    endDate: row.end_date || "",
    createdAt: row.created_at,
  };
}

function toRow(body) {
  const clean = (v) => (typeof v === "string" && v.trim() ? v.trim() : null);
  return {
    category: CATEGORIES.includes(body.category) ? body.category : "billable",
    client: clean(body.client),
    title: String(body.title || "").trim(),
    role: clean(body.role),
    description: String(body.description || "").trim(),
    image: clean(body.image),
    tags: Array.isArray(body.tags)
      ? body.tags.map((t) => String(t).trim()).filter(Boolean)
      : [],
    live_url: clean(body.liveUrl),
    repo_url: clean(body.repoUrl),
    start_date: clean(body.startDate),
    end_date: clean(body.endDate),
  };
}

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("ibm_projects")
    .select("*")
    .order("start_date", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data.map(toClient));
}

export async function POST(request) {
  const supabase = await createClient();
  const row = toRow(await request.json());
  if (!row.title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const { data, error } = await supabase.from("ibm_projects").insert(row).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(toClient(data));
}

export async function PUT(request) {
  const supabase = await createClient();
  const body = await request.json();
  if (!body.id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const row = toRow(body);
  if (!row.title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("ibm_projects")
    .update(row)
    .eq("id", body.id)
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(toClient(data));
}

export async function DELETE(request) {
  const supabase = await createClient();
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const { error } = await supabase.from("ibm_projects").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
