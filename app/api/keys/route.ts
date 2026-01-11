import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { normalizeKey } from "@/app/api/keys/utils";

const normalizeRow = (row: {
  id: string;
  key: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}) =>
  normalizeKey({
    id: row.id,
    key: row.key,
    name: row.name,
    description: row.description,
    created_at: row.created_at,
    updated_at: row.updated_at,
  });

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("api_keys")
    .select("id, key, name, description, created_at, updated_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[get-keys] Supabase error", error);
    return NextResponse.json({ error: "Unable to load API keys" }, { status: 500 });
  }

  return NextResponse.json((data ?? []).map(normalizeRow));
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body.name !== "string" || !body.name.trim()) {
    return NextResponse.json({ error: "Missing key name" }, { status: 400 });
  }

  const description =
    typeof body.description === "string" && body.description.trim().length > 0
      ? body.description.trim()
      : null;

  const { data, error } = await supabaseAdmin
    .from("api_keys")
    .insert([{ name: body.name.trim(), description }])
    .select("id, key, name, description, created_at, updated_at")
    .maybeSingle();

  if (error || !data) {
    console.error("[create-key] Supabase error", error, data);
    return NextResponse.json({ error: "Unable to create key" }, { status: 500 });
  }

  return NextResponse.json(normalizeRow(data), { status: 201 });
}

