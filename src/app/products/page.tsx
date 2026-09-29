import { HydrationBoundary } from "@tanstack/react-query";
import { ProductsPage, prefetchProductList } from "@/features/products";
import type { ProductSearchParams } from "@/features/products";

export default async function ProductsRoute({
  searchParams,
}: {
  searchParams: Promise<ProductSearchParams>;
}) {
  const params = await searchParams;
  return (
    <HydrationBoundary state={await prefetchProductList(params)}>
      <ProductsPage searchParams={params} />
    </HydrationBoundary>
  );
}
