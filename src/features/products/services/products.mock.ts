import { mockProducts } from "@/features/products/services/products.mock-data";
import { createInMemoryProductsService } from "@/features/products/services/products.in-memory";

/** In-repo catalogue: the default, so the site runs with no setup. */
export const mockProductsService = createInMemoryProductsService(
  async () => mockProducts,
);
