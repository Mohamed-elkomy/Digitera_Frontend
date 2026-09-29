import type { Metadata } from "next";
import { HydrationBoundary } from "@tanstack/react-query";
import { ProductDetailsWithCart } from "@/app/products/[productId]/product-details-with-cart";
import { prefetchProduct, productsService } from "@/features/products";

type ProductRouteProps = {
  params: Promise<{ productId: string }>;
};

export async function generateMetadata({
  params,
}: ProductRouteProps): Promise<Metadata> {
  const { productId } = await params;
  const product = await productsService.getById(productId);

  if (!product) {
    return { title: "Fragrance not found" };
  }

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images,
    },
  };
}

export default async function ProductDetailsRoute({
  params,
}: ProductRouteProps) {
  const { productId } = await params;
  return (
    <HydrationBoundary state={await prefetchProduct(productId)}>
      <ProductDetailsWithCart productId={productId} />
    </HydrationBoundary>
  );
}
