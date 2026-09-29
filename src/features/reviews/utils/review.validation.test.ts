import {
  normalizeReview,
  validateReview,
} from "@/features/reviews/utils/review.validation";

describe("validateReview", () => {
  it("accepts a complete review", () => {
    expect(
      validateReview({
        productId: "sol-dor",
        author: "Salma",
        rating: 5,
        comment: "Lovely and long-lasting.",
      }),
    ).toEqual({});
  });

  it("flags a missing name, a missing rating and a short comment", () => {
    expect(
      validateReview({ productId: "x", author: " ", rating: 0, comment: "ok" }),
    ).toEqual({
      author: "nameRequired",
      rating: "ratingRequired",
      comment: "commentTooShort",
    });
  });

  it("rejects ratings outside 1–5", () => {
    expect(
      validateReview({
        productId: "x",
        author: "A",
        rating: 6,
        comment: "0123456789",
      }).rating,
    ).toBe("ratingRequired");
  });
});

it("normalizes untrusted input", () => {
  expect(
    normalizeReview({ author: "  Omar ", rating: "5", comment: 3 }),
  ).toEqual({
    productId: "",
    author: "Omar",
    rating: 0,
    comment: "",
  });
});
