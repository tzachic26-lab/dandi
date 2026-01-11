import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

const isValidKeyRequest = (payload: unknown): payload is { key: string } =>
  !!payload && typeof payload === "object" && "key" in payload && typeof (payload as any).key === "string";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!isValidKeyRequest(body)) {
    return NextResponse.json({ valid: false, message: "Missing key" }, { status: 400 });
  }

  const trimmedKey = body.key.trim();
  if (!trimmedKey) {
    return NextResponse.json({ valid: false, message: "Key cannot be empty" }, { status: 400 });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from("api_keys")
      .select("id")
      .eq("key", trimmedKey)
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("[verify-key] Supabase error", error);
      return NextResponse.json(
        { valid: false, message: "Unable to verify key" },
        { status: 500 }
      );
    }

    if (data) {
      return NextResponse.json({ valid: true });
    }

    return NextResponse.json(
      { valid: false, message: "Key not found" },
      { status: 401 }
    );
  } catch (error) {
    console.error("[verify-key] unexpected error", error);
    return NextResponse.json(
      { valid: false, message: "Unable to verify key" },
      { status: 500 }
    );
  }
}

