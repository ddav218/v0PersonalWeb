"use server";

import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  // Normalize snake_case to camelCase for frontend
  const normalized = data.map((p) => ({
    ...p,
    liveUrl: p.live_url,
    repoUrl: p.repo_url,
  }));
  return NextResponse.json(normalized);
}

export async function POST(request) {
  const supabase = await createClient();
  const body = await request.json();

  const { data, error } = await supabase
    .from("projects")
    .insert({
      title: body.title,
      description: body.description,
      image: body.image || "/images/project-1.jpg",
      tags: body.tags || [],
      live_url: body.liveUrl || "#",
      repo_url: body.repoUrl || "#",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ...data, liveUrl: data.live_url, repoUrl: data.repo_url });
}

export async function PUT(request) {
  const supabase = await createClient();
  const body = await request.json();

  const { data, error } = await supabase
    .from("projects")
    .update({
      title: body.title,
      description: body.description,
      image: body.image,
      tags: body.tags || [],
      live_url: body.liveUrl,
      repo_url: body.repoUrl,
    })
    .eq("id", body.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ...data, liveUrl: data.live_url, repoUrl: data.repo_url });
}

export async function DELETE(request) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  const { error } = await supabase.from("projects").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
