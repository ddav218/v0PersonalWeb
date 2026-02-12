import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("skills")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const grouped = {
    programmingLanguages: data.filter((s) => s.category === "programmingLanguages"),
    digitalMediaTools: data.filter((s) => s.category === "digitalMediaTools"),
  };
  return NextResponse.json(grouped);
}

export async function POST(request) {
  const supabase = await createClient();
  const body = await request.json();

  const { data, error } = await supabase
    .from("skills")
    .insert({
      name: body.name,
      level: body.level,
      category: body.category,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function PUT(request) {
  const supabase = await createClient();
  const body = await request.json();

  const { data, error } = await supabase
    .from("skills")
    .update({
      name: body.name,
      level: body.level,
    })
    .eq("id", body.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function DELETE(request) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  const { error } = await supabase.from("skills").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
