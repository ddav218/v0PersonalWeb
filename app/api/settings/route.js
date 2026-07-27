import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// Simple key/value settings store (e.g. Credly username)
export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("app_settings").select("*");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  const settings = {};
  for (const row of data) {
    settings[row.key] = row.value;
  }
  return NextResponse.json(settings);
}

export async function PUT(request) {
  const supabase = await createClient();
  const body = await request.json();

  const { key, value } = body;
  if (!key) {
    return NextResponse.json({ error: "Missing key" }, { status: 400 });
  }

  const { error } = await supabase
    .from("app_settings")
    .upsert({ key, value: value ?? "", updated_at: new Date().toISOString() }, { onConflict: "key" });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
