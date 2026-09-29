export type ReviewInput = {
  productId: string;
  author: string;
  rating: number;
  comment: string;
};

export type ReviewErrorKey =
  "nameRequired" | "ratingRequired" | "commentTooShort";
export type ReviewErrors = Partial<
  Record<"author" | "rating" | "comment", ReviewErrorKey>
>;

export const MIN_REVIEW_LENGTH = 10;

/** Shared by the form and the API route. */
export function validateReview(input: ReviewInput): ReviewErrors {
  const errors: ReviewErrors = {};
  if (!input.author.trim()) errors.author = "nameRequired";
  if (!Number.isInteger(input.rating) || input.rating < 1 || input.rating > 5) {
    errors.rating = "ratingRequired";
  }
  if (input.comment.trim().length < MIN_REVIEW_LENGTH)
    errors.comment = "commentTooShort";
  return errors;
}

export function normalizeReview(body: unknown): ReviewInput {
  const input =
    typeof body === "object" && body !== null
      ? (body as Record<string, unknown>)
      : {};
  const text = (value: unknown, max: number) =>
    typeof value === "string" ? value.trim().slice(0, max) : "";

  return {
    productId: text(input.productId, 100),
    author: text(input.author, 80),
    rating: typeof input.rating === "number" ? input.rating : 0,
    comment: text(input.comment, 1500),
  };
}
