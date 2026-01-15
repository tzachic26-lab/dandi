import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const sessionCookie = request.cookies.get("google_session");
  if (!sessionCookie) {
    return NextResponse.json({ authenticated: false });
  }

  try {
    const session = JSON.parse(sessionCookie.value);
    const payload = session.id_token?.split?.(".")[1];
    const decoded = payload
      ? JSON.parse(Buffer.from(payload, "base64").toString("utf-8"))
      : null;

    return NextResponse.json({
      authenticated: true,
      email: decoded?.email,
      name: decoded?.name,
      picture: decoded?.picture,
    });
  } catch {
    return NextResponse.json({ authenticated: false });
  }
}
