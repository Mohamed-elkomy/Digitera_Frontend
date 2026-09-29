import { QueryClient, dehydrate } from "@tanstack/react-query";
import { productQueryKeys } from "@/features/products/hooks/product-query-keys";
import { productsService } from "@/features/products/services/products.service";
import type { ProductSearchParams } from "@/features/products/types/product.types";
import { parseProductListQuery } from "@/features/products/utils/product.query";

/**
 * Fetches on the server what the page would otherwise fetch after hydration,
 * so the first HTML already contains the products and their photos — the
 * difference between a skeleton and the real page on a slow phone connection.
 */
export async function prefetchProductList(searchParams: ProductSearchParams) {
  const client = new QueryClient();
  const query = parseProductListQuery(searchParams);
  await client.prefetchQuery({
    queryKey: productQueryKeys.list(query),
    queryFn: () => productsService.list(query),
  });
  return dehydrate(client);
}

export async function prefetchProduct(productId: string) {
  const client = new QueryClient();
  await client.prefetchQuery({
    queryKey: productQueryKeys.detail(productId),
    queryFn: () => productsService.getById(productId),
  });
  return dehydrate(client);
}
