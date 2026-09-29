import { NextResponse } from "next/server";
import { normalizeInquiry, validateInquiry } from "@/features/inquiries";
import { isSanityConfigured, sanityCreate } from "@/lib/sanity/client";

/**
 * Stores a contact-form inquiry in Sanity, where the owner reads and manages
 * it. The write token never leaves the server.
 */
export async function POST(request: Request) {
  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!token || !isSanityConfigured()) {
    return NextResponse.json({ error: "not-configured" }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid-json" }, { status: 400 });
  }

  const inquiry = normalizeInquiry(
    typeof body === "object" && body !== null ? body : {},
  );
  const errors = validateInquiry(inquiry);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 422 });
  }

  try {
    await sanityCreate(
      {
        _type: "inquiry",
        ...inquiry,
        status: "new",
        submittedAt: new Date().toISOString(),
      },
      token,
    );
  } catch {
    return NextResponse.json({ error: "store-failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
