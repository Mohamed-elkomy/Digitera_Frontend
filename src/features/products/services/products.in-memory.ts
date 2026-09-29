import type { ProductsService } from "@/features/products/services/products.service";
import type { Product } from "@/features/products/types/product.types";
import {
  DEFAULT_PAGE_SIZE,
  filterProducts,
  paginate,
  sortProducts,
} from "@/features/products/utils/product.query";

/**
 * Filtering, sorting and paging over a full catalogue held in memory. The
 * catalogue is small (a few dozen bottles), so the mock data and Sanity share
 * one tested implementation instead of each re-implementing the rules.
 */
export function createInMemoryProductsService(
  load: () => Promise<Product[]>,
): ProductsService {
  return {
    async list(query) {
      const products = await load();
      const page = query.page ?? 1;
      const pageSize = query.pageSize ?? DEFAULT_PAGE_SIZE;
      const filtered = filterProducts(products, query);
      const sorted = sortProducts(filtered, query.sort);

      return {
        items: paginate(sorted, page, pageSize),
        total: filtered.length,
        page,
        pageSize,
      };
    },

    async getById(id) {
      const products = await load();
      return products.find((product) => product.id === id) ?? null;
    },

    async listRelated(id, limit = 4) {
      const products = await load();
      const product = products.find((entry) => entry.id === id);
      if (!product) return [];

      const sameFamily = products.filter(
        (entry) =>
          entry.id !== product.id && entry.scentFamily === product.scentFamily,
      );
      const others = products.filter(
        (entry) =>
          entry.id !== product.id && entry.scentFamily !== product.scentFamily,
      );

      return [...sameFamily, ...others].slice(0, limit);
    },
  };
}
