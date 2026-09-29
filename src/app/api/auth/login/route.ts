import { NextResponse } from "next/server";
import { authUnavailable, readJson, text } from "@/app/api/auth/guard";
import { findCustomerByEmail, startSession } from "@/features/auth/server";
import { verifyPassword } from "@/lib/auth/password";

export async function POST(request: Request) {
  const unavailable = authUnavailable();
  if (unavailable) return unavailable;

  const body = await readJson(request);
  const email = text(body.email).trim();
  const password = text(body.password);

  const customer = email ? await findCustomerByEmail(email) : null;
  // Same answer for "no such email" and "wrong password": nothing to probe.
  if (!customer || !(await verifyPassword(password, customer.passwordHash))) {
    return NextResponse.json({ error: "invalidCredentials" }, { status: 401 });
  }

  await startSession({
    id: customer.id,
    name: customer.name,
    email: customer.email,
  });
  return NextResponse.json({
    user: { name: customer.name, email: customer.email },
  });
}
