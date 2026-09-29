import { createHmac, timingSafeEqual } from "node:crypto";

export const SESSION_COOKIE = "odoratus_session";
export const SESSION_DAYS = 30;

export type SessionUser = {
  id: string;
  name: string;
  email: string;
};

type Payload = SessionUser & { exp: number };

function secret(): string | undefined {
  const value = process.env.AUTH_SECRET;
  return value && value.length >= 32 ? value : undefined;
}

export function isAuthConfigured(): boolean {
  return Boolean(secret());
}

function sign(data: string, key: string): string {
  return createHmac("sha256", key).update(data).digest("base64url");
}

/** payload.signature — tamper-proof, but readable, so it never holds secrets. */
export function createSessionToken(
  user: SessionUser,
  now = Date.now(),
): string {
  const key = secret();
  if (!key) throw new Error("AUTH_SECRET is not set (32+ characters).");

  const payload: Payload = { ...user, exp: now + SESSION_DAYS * 86_400_000 };
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${data}.${sign(data, key)}`;
}

export function readSessionToken(
  token: string | undefined,
  now = Date.now(),
): SessionUser | null {
  const key = secret();
  if (!key || !token) return null;

  const [data, signature] = token.split(".");
  if (!data || !signature) return null;

  const expected = Buffer.from(sign(data, key));
  const given = Buffer.from(signature);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(data, "base64url").toString(),
    ) as Payload;
    if (typeof payload.exp !== "number" || payload.exp < now) return null;
    return { id: payload.id, name: payload.name, email: payload.email };
  } catch {
    return null;
  }
}

/** httpOnly (no JavaScript can read it), Secure in production, SameSite=Lax. */
export function sessionCookieOptions(maxAgeSeconds = SESSION_DAYS * 86_400) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: maxAgeSeconds,
  };
}
