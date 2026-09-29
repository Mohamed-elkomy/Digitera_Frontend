import { NextResponse } from "next/server";
import { isAuthConfigured } from "@/lib/auth/session";
import { isSanityConfigured, serverToken } from "@/lib/sanity/client";

/** Accounts need the database, a write token and a session secret. */
export function authUnavailable(): NextResponse | null {
  if (isSanityConfigured() && serverToken() && isAuthConfigured()) return null;
  return NextResponse.json({ error: "not-configured" }, { status: 503 });
}

export async function readJson(
  request: Request,
): Promise<Record<string, unknown>> {
  const body: unknown = await request.json().catch(() => null);
  return typeof body === "object" && body !== null
    ? (body as Record<string, unknown>)
    : {};
}

export const text = (value: unknown, max = 200) =>
  typeof value === "string" ? value.slice(0, max) : "";
