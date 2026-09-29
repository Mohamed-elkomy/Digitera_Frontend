import { env } from "@/config/env";
import { mockReviewsFor } from "@/features/reviews/services/reviews.mock-data";
import type { Review } from "@/features/reviews/types/review.types";
import type { ReviewInput } from "@/features/reviews/utils/review.validation";
import {
  clampRating,
  newestFirst,
} from "@/features/reviews/utils/review.utils";
import { isSanityConfigured, sanityFetch } from "@/lib/sanity/client";

export type ReviewsService = {
  listForProduct(productId: string): Promise<Review[]>;
  /** New reviews wait for the owner's approval before they are shown. */
  submit(review: ReviewInput): Promise<void>;
};

/** Only reviews the owner approved in the dashboard reach the storefront. */
const REVIEWS_QUERY = `*[_type == "review" && approved == true && product->slug.current == $productId] {
  "id": _id,
  "productId": product->slug.current,
  author,
  rating,
  comment,
  "createdAt": coalesce(createdAt, _createdAt)
}`;

const mockReviewsService: ReviewsService = {
  async listForProduct(productId) {
    return newestFirst(mockReviewsFor(productId));
  },
  async submit() {
    await new Promise((resolve) => setTimeout(resolve, 600));
  },
};

const sanityReviewsService: ReviewsService = {
  async listForProduct(productId) {
    const reviews = await sanityFetch<Review[]>(REVIEWS_QUERY, { productId });
    return newestFirst(
      reviews.map((review) => ({
        ...review,
        rating: clampRating(review.rating),
      })),
    );
  },
  async submit(review) {
    const response = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(review),
    });
    if (!response.ok) throw new Error(`Review failed: ${response.status}`);
  },
};

export const reviewsService: ReviewsService =
  !env.useMockApi && isSanityConfigured()
    ? sanityReviewsService
    : mockReviewsService;
