jest.mock("@/config/env", () => ({
  env: { sanityProjectId: "abc123", sanityDataset: "production" },
}));

import { sanityImageUrl } from "@/lib/sanity/client";

describe("sanityImageUrl", () => {
  it("builds the CDN URL from an asset reference", () => {
    expect(sanityImageUrl("image-9f86d081-800x1000-png")).toBe(
      "https://cdn.sanity.io/images/abc123/production/9f86d081-800x1000.png?auto=format&w=1200",
    );
  });

  it("returns null for anything that is not an image reference", () => {
    expect(sanityImageUrl(undefined)).toBeNull();
    expect(sanityImageUrl("file-abc-pdf")).toBeNull();
  });
});
