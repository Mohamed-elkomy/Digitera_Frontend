import type { Review } from "@/features/reviews/types/review.types";
import {
  clampRating,
  newestFirst,
} from "@/features/reviews/utils/review.utils";
import { sanityFetch } from "@/lib/sanity/client";

/** Only reviews the owner approved in the dashboard reach the storefront. */
const REVIEWS_QUERY = `*[_type == "review" && approved == true && product->slug.current == $productId] {
  "id": _id,
  "productId": product->slug.current,
  author,
  rating,
  comment,
  "createdAt": coalesce(createdAt, _createdAt)
}`;

/** Server-only: reads the private dataset. */
export async function listApprovedReviews(
  productId: string,
): Promise<Review[]> {
  const reviews = await sanityFetch<Review[]>(REVIEWS_QUERY, { productId });
  return newestFirst(
    reviews.map((review) => ({
      ...review,
      rating: clampRating(review.rating),
    })),
  );
}
