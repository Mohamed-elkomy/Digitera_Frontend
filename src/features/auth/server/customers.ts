import { randomUUID } from "node:crypto";
import { sanityFetch, sanityMutate } from "@/lib/sanity/client";

export type CustomerRecord = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
};

const BY_EMAIL = `*[_type == "customer" && email == $email][0]{
  "id": _id, name, email, passwordHash
}`;

/** Emails are compared lower-cased and trimmed, so "Salma@X.com" is one account. */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export async function findCustomerByEmail(
  email: string,
): Promise<CustomerRecord | null> {
  return sanityFetch<CustomerRecord | null>(BY_EMAIL, {
    email: normalizeEmail(email),
  });
}

export async function createCustomer(input: {
  name: string;
  email: string;
  passwordHash: string;
}): Promise<CustomerRecord> {
  const record = {
    id: `customer-${randomUUID()}`,
    name: input.name.trim(),
    email: normalizeEmail(input.email),
    passwordHash: input.passwordHash,
  };
  await sanityMutate([
    {
      create: {
        _id: record.id,
        _type: "customer",
        name: record.name,
        email: record.email,
        passwordHash: record.passwordHash,
        createdAt: new Date().toISOString(),
      },
    },
  ]);
  return record;
}

export async function updateCustomer(
  id: string,
  changes: { name: string; email: string },
): Promise<void> {
  await sanityMutate([
    {
      patch: {
        id,
        set: {
          name: changes.name.trim(),
          email: normalizeEmail(changes.email),
        },
      },
    },
  ]);
}
