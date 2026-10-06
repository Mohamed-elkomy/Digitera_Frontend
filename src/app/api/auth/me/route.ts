import { NextResponse } from "next/server";
import { authUnavailable, readJson, text } from "@/app/api/auth/guard";
import { isValidEmail, MIN_NAME_LENGTH } from "@/features/auth";
import {
  findCustomerByEmail,
  getSessionUser,
  normalizeEmail,
  startSession,
  updateCustomer,
} from "@/features/auth/server";
import { isDemoAccount } from "@/lib/auth/demo";

export async function GET() {
  const unavailable = authUnavailable();
  if (unavailable) return unavailable;

  const user = await getSessionUser();
  return user
    ? NextResponse.json({ user: { name: user.name, email: user.email } })
    : NextResponse.json({ user: null }, { status: 401 });
}

/** Updates the signed-in customer's name and email. */
export async function PATCH(request: Request) {
  const unavailable = authUnavailable();
  if (unavailable) return unavailable;

  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "signedOut" }, { status: 401 });
  if (isDemoAccount(user.email)) {
    return NextResponse.json({ error: "demoLocked" }, { status: 403 });
  }

  const body = await readJson(request);
  const name = text(body.name, 80).trim();
  const email = text(body.email).trim();
  if (name.length < MIN_NAME_LENGTH || !isValidEmail(email)) {
    return NextResponse.json({ error: "invalid" }, { status: 422 });
  }

  if (normalizeEmail(email) !== user.email) {
    const owner = await findCustomerByEmail(email);
    if (owner && owner.id !== user.id) {
      return NextResponse.json({ error: "emailTaken" }, { status: 409 });
    }
  }

  await updateCustomer(user.id, { name, email });
  const next = { id: user.id, name, email: normalizeEmail(email) };
  await startSession(next);
  return NextResponse.json({ user: { name: next.name, email: next.email } });
}
