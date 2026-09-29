jest.mock("@/config/env", () => ({
  env: {
    useMockApi: true,
    sanityProjectId: "abc123",
    sanityDataset: "production",
  },
}));

import { toProduct } from "@/features/products/services/products.sanity";

const complete = {
  id: "fleur-de-lune",
  sku: "ODORATUS-FDL",
  name: "Fleur de Lune",
  description: "Moonlight on linen.",
  notes: "Floral / Jasmine & White Musk",
  scentNotes: { top: ["Neroli"], heart: ["Jasmine"], base: ["Musk"] },
  variants: [
    { id: "50ml", volume: 50, label: "50 ml", price: 160, inStock: true },
  ],
  giftWrappingAvailable: true,
  images: ["image-9f86d081-800x1000-png"],
  category: "pure-extractions",
  scentFamily: "floral",
  occasion: "personal-use",
  availability: "in-stock" as const,
};

describe("toProduct", () => {
  it("carries the Arabic copy from the dashboard when it has a name", () => {
    const withArabic = toProduct({
      ...complete,
      ar: {
        name: "فلور دي لون",
        notes: "زهري",
        description: "…",
        scentNotes: { top: ["نيرولي"] },
      },
    });
    expect(withArabic?.ar?.name).toBe("فلور دي لون");
    expect(withArabic?.ar?.scentNotes.heart).toEqual([]);
    expect(toProduct({ ...complete, ar: { name: "" } })?.ar).toBeUndefined();
  });

  it("maps a dashboard document onto the storefront's product shape", () => {
    const product = toProduct(complete);
    expect(product?.id).toBe("fleur-de-lune");
    expect(product?.images[0]).toContain(
      "cdn.sanity.io/images/abc123/production/",
    );
    expect(product?.variants).toHaveLength(1);
  });

  it("skips products the owner has not finished (no name or no priced size)", () => {
    expect(toProduct({ ...complete, name: undefined })).toBeNull();
    expect(toProduct({ ...complete, variants: [{ id: "50ml" }] })).toBeNull();
  });

  it("fills safe defaults for optional fields", () => {
    const product = toProduct({
      id: "x",
      name: "X",
      variants: [{ id: "30ml", volume: 30, price: 90 }],
    });
    expect(product?.variants[0]).toMatchObject({
      label: "30 ml",
      inStock: true,
    });
    expect(product?.availability).toBe("in-stock");
    expect(product?.scentNotes).toEqual({ top: [], heart: [], base: [] });
  });
});
