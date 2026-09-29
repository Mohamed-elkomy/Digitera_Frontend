import { env } from "@/config/env";
import { mockReviewsFor } from "@/features/reviews/services/reviews.mock-data";
import type { Review } from "@/features/reviews/types/review.types";
import type { ReviewInput } from "@/features/reviews/utils/review.validation";
import { newestFirst } from "@/features/reviews/utils/review.utils";
import { apiGet } from "@/lib/api/client";

export type ReviewsService = {
  listForProduct(productId: string): Promise<Review[]>;
  /** New reviews wait for the owner's approval before they are shown. */
  submit(review: ReviewInput): Promise<void>;
};

const mockReviewsService: ReviewsService = {
  async listForProduct(productId) {
    return newestFirst(mockReviewsFor(productId));
  },
  async submit() {
    await new Promise((resolve) => setTimeout(resolve, 600));
  },
};

/** Goes through our /api/reviews route, which reads and writes Sanity. */
const httpReviewsService: ReviewsService = {
  async listForProduct(productId) {
    return apiGet<Review[]>(
      `/reviews?productId=${encodeURIComponent(productId)}`,
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

export const reviewsService: ReviewsService = env.useMockApi
  ? mockReviewsService
  : httpReviewsService;
