import type {
  Review,
  ReviewSummary,
} from "@/features/reviews/types/review.types";

/** Average to one decimal place, e.g. 4.7. Zero when there are no reviews. */
export function summarizeReviews(reviews: Review[]): ReviewSummary {
  if (reviews.length === 0) return { average: 0, count: 0 };

  const total = reviews.reduce((sum, review) => sum + review.rating, 0);
  return {
    average: Math.round((total / reviews.length) * 10) / 10,
    count: reviews.length,
  };
}

/** Clamps anything outside 1–5 so a bad entry can never draw six stars. */
export function clampRating(rating: number): number {
  if (!Number.isFinite(rating)) return 0;
  return Math.min(5, Math.max(1, Math.round(rating)));
}

export function newestFirst(reviews: Review[]): Review[] {
  return [...reviews].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
