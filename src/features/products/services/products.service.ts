import { env } from "@/config/env";
import { httpProductsService } from "@/features/products/services/products.http";
import { mockProductsService } from "@/features/products/services/products.mock";
import { sanityProductsService } from "@/features/products/services/products.sanity";
import { isSanityConfigured } from "@/lib/sanity/client";
import type {
  Product,
  ProductId,
  ProductListQuery,
  ProductListResult,
} from "@/features/products/types/product.types";

export type ProductsService = {
  list(query: ProductListQuery): Promise<ProductListResult>;
  getById(id: ProductId): Promise<Product | null>;
  listRelated(id: ProductId, limit?: number): Promise<Product[]>;
};

export function createProductsService(): ProductsService {
  if (env.useMockApi) return mockProductsService;
  return isSanityConfigured() ? sanityProductsService : httpProductsService;
}

export const productsService = createProductsService();
