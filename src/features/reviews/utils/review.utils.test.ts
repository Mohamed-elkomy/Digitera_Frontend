import {
  clampRating,
  newestFirst,
  summarizeReviews,
} from "@/features/reviews/utils/review.utils";
import type { Review } from "@/features/reviews/types/review.types";

const review = (rating: number, createdAt = "2026-09-01"): Review => ({
  id: `${rating}-${createdAt}`,
  productId: "sol-dor",
  author: "A",
  rating,
  comment: "",
  createdAt,
});

describe("summarizeReviews", () => {
  it("averages to one decimal place", () => {
    expect(summarizeReviews([review(5), review(4), review(4)])).toEqual({
      average: 4.3,
      count: 3,
    });
  });

  it("is zero with no reviews", () => {
    expect(summarizeReviews([])).toEqual({ average: 0, count: 0 });
  });
});

describe("clampRating", () => {
  it.each([
    [7, 5],
    [0, 1],
    [3.6, 4],
    [Number.NaN, 0],
  ])("clamps %p to %p", (input, expected) => {
    expect(clampRating(input)).toBe(expected);
  });
});

it("sorts the newest review first", () => {
  const sorted = newestFirst([
    review(5, "2026-01-01"),
    review(4, "2026-06-01"),
  ]);
  expect(sorted.map((entry) => entry.createdAt)).toEqual([
    "2026-06-01",
    "2026-01-01",
  ]);
});
