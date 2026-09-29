import { NextResponse } from "next/server";
import {
  listApprovedReviews,
  normalizeReview,
  validateReview,
} from "@/features/reviews";
import {
  isSanityConfigured,
  sanityCreate,
  sanityFetch,
} from "@/lib/sanity/client";

/** Approved reviews for one product. */
export async function GET(request: Request) {
  const productId = new URL(request.url).searchParams.get("productId") ?? "";
  if (!isSanityConfigured() || !productId) {
    return NextResponse.json([], { status: isSanityConfigured() ? 400 : 503 });
  }
  try {
    return NextResponse.json(await listApprovedReviews(productId));
  } catch {
    return NextResponse.json({ error: "unavailable" }, { status: 503 });
  }
}

/**
 * Stores a customer review as hidden. It appears on the product page only
 * after the owner ticks "Show on website" in the dashboard.
 */
export async function POST(request: Request) {
  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!token || !isSanityConfigured()) {
    return NextResponse.json({ error: "not-configured" }, { status: 503 });
  }

  const review = normalizeReview(await request.json().catch(() => null));
  const errors = validateReview(review);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 422 });
  }

  const productRef = await sanityFetch<string | null>(
    `*[_type == "product" && slug.current == $slug && !(_id in path("drafts.**"))][0]._id`,
    { slug: review.productId },
  );
  if (!productRef)
    return NextResponse.json({ error: "unknown-product" }, { status: 404 });

  try {
    await sanityCreate(
      {
        _type: "review",
        product: { _type: "reference", _ref: productRef },
        author: review.author,
        rating: review.rating,
        comment: review.comment,
        createdAt: new Date().toISOString().slice(0, 10),
        approved: false,
      },
      token,
    );
  } catch {
    return NextResponse.json({ error: "store-failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
