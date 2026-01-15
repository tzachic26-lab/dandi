import type { NextRequest } from "next/server";

type GoogleSession = {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  id_token?: string;
};

export const parseGoogleSession = (rawValue?: string | null): GoogleSession | null => {
  if (!rawValue) return null;
  try {
    return JSON.parse(rawValue) as GoogleSession;
  } catch {
    return null;
  }
};

export const requireGoogleSession = (request: NextRequest): GoogleSession | null => {
  const cookieValue = request.cookies.get("google_session")?.value ?? null;
  const session = parseGoogleSession(cookieValue);
  if (!session?.id_token) return null;
  return session;
};
