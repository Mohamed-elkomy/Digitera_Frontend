export type Review = {
  id: string;
  productId: string;
  author: string;
  /** Whole stars, 1 to 5. */
  rating: number;
  comment: string;
  /** ISO date the review was written. */
  createdAt: string;
};

export type ReviewSummary = {
  average: number;
  count: number;
};
