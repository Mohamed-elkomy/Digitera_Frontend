"use client";

import { useQuery } from "@tanstack/react-query";
import { reviewsService } from "@/features/reviews/services/reviews.service";

export function useProductReviews(productId: string) {
  return useQuery({
    queryKey: ["reviews", productId],
    queryFn: () => reviewsService.listForProduct(productId),
  });
}
