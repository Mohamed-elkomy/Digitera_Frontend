"use client";

import { useQueries } from "@tanstack/react-query";
import { productsService, type Product } from "@/features/products";

/** Resolves saved ids against the live catalogue. */
export function useWishlistProducts(ids: string[]) {
  const results = useQueries({
    queries: ids.map((id) => ({
      queryKey: ["products", "detail", id],
      queryFn: () => productsService.getById(id),
    })),
  });

  return {
    products: results
      .map((result) => result.data)
      .filter((product): product is Product => Boolean(product)),
    isLoading: results.some((result) => result.isLoading),
    isError: results.some((result) => result.isError),
  };
}
