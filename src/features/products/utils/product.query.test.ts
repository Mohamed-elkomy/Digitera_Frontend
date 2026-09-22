import { mockProducts } from "@/features/products/services/products.mock-data";
import {
  filterProducts,
  paginate,
  parseProductListQuery,
  sortProducts,
} from "./product.query";

describe("parseProductListQuery", () => {
  it("reads repeated and comma-separated filters as lists", () => {
    expect(
      parseProductListQuery({
        search: " oud ",
        category: ["pure-extractions", "atelier-oils"],
        scentFamily: "woody,floral",
        page: "2",
      }),
    ).toEqual({
      search: "oud",
      category: ["pure-extractions", "atelier-oils"],
      scentFamily: ["woody", "floral"],
      occasion: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      sort: undefined,
      page: 2,
      pageSize: 6,
    });
  });

  it("ignores an unknown sort value", () => {
    expect(parseProductListQuery({ sort: "random" }).sort).toBeUndefined();
  });
});

describe("filterProducts", () => {
  it("searches the name and the scent notes", () => {
    const found = filterProducts(mockProducts, { search: "saffron" });
    expect(found.map((p) => p.id)).toEqual(["atelier-oud"]);
  });

  it("filters by scent family", () => {
    const found = filterProducts(mockProducts, { scentFamily: ["floral"] });
    expect(found).toHaveLength(2);
  });

  it("keeps products whose range overlaps the price filter", () => {
    const found = filterProducts(mockProducts, { minPrice: 260 });
    expect(found.map((p) => p.id)).toEqual(["atelier-oud"]);
  });
});

describe("sortProducts", () => {
  it("sorts by the signature size price", () => {
    const sorted = sortProducts(mockProducts, "price-asc");
    expect(sorted[0].id).toBe("sol-dor");
    expect(sorted.at(-1)?.id).toBe("atelier-oud");
  });

  it("sorts by name", () => {
    expect(sortProducts(mockProducts, "name-asc")[0].name).toBe("Atelier Oud");
  });
});

describe("paginate", () => {
  it("returns the requested slice", () => {
    expect(paginate([1, 2, 3, 4, 5], 2, 2)).toEqual([3, 4]);
  });
});
