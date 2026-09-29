import { NextResponse } from "next/server";
import { authUnavailable, readJson, text } from "@/app/api/auth/guard";
import { hasErrors, validateSignup } from "@/features/auth";
import {
  createCustomer,
  findCustomerByEmail,
  startSession,
} from "@/features/auth/server";
import { hashPassword } from "@/lib/auth/password";

export async function POST(request: Request) {
  const unavailable = authUnavailable();
  if (unavailable) return unavailable;

  const body = await readJson(request);
  const values = {
    name: text(body.name, 80).trim(),
    email: text(body.email).trim(),
    password: text(body.password, 200),
    confirmPassword: text(body.password, 200),
    acceptedTerms: body.acceptedTerms === true,
  };
  const errors = validateSignup(values);
  if (hasErrors(errors)) return NextResponse.json({ errors }, { status: 422 });

  if (await findCustomerByEmail(values.email)) {
    return NextResponse.json({ error: "emailTaken" }, { status: 409 });
  }

  const customer = await createCustomer({
    name: values.name,
    email: values.email,
    passwordHash: await hashPassword(values.password),
  });
  const user = { id: customer.id, name: customer.name, email: customer.email };
  await startSession(user);
  return NextResponse.json(
    { user: { name: user.name, email: user.email } },
    { status: 201 },
  );
}
