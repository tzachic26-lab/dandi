import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { requireGoogleSession } from "@/app/api/auth/utils";
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id?: string }> }
) {
  if (!requireGoogleSession(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "Missing key id" }, { status: 400 });
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Missing payload" }, { status: 400 });
  }

  const data: { name?: string; description?: string | null } = {};

  if (typeof body.name === "string" && body.name.trim()) {
    data.name = body.name.trim();
  }

  if (typeof body.description === "string") {
    const trimmed = body.description.trim();
    data.description = trimmed ? trimmed : null;
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json(
      { error: "Provide name or description to update" },
      { status: 400 }
    );
  }

  const payload: Record<string, unknown> = {};
  if (data.name) payload.name = data.name;
  if (Object.prototype.hasOwnProperty.call(data, "description")) {
    payload.description = data.description;
  }

  if (Object.keys(payload).length === 0) {
    return NextResponse.json(
      { error: "Provide name or description to update" },
      { status: 400 }
    );
  }

  const { data: updated, error } = await supabaseAdmin
    .from("api_keys")
    .update(payload)
    .eq("id", id)
    .select("id, key, name, description, created_at, updated_at")
    .maybeSingle();

  if (error) {
    console.error("[update-key] Supabase error", error);
    return NextResponse.json({ error: "Unable to update key" }, { status: 500 });
  }

  if (!updated) {
    return NextResponse.json({ error: "Key not found" }, { status: 404 });
  }

  return NextResponse.json(normalizeRow(updated));
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id?: string }> }
) {
  if (!requireGoogleSession(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "Missing key id" }, { status: 400 });
  }

  const { error } = await supabaseAdmin.from("api_keys").delete().eq("id", id);

  if (error) {
    console.error("[delete-key] Supabase error", error);
    return NextResponse.json({ error: "Unable to delete key" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

