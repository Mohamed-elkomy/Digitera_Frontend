import { useWishlistStore } from "@/features/wishlist/store/wishlist.store";

beforeEach(() => useWishlistStore.setState({ ids: [] }));

describe("wishlist store", () => {
  it("adds a product on the first toggle and removes it on the second", () => {
    expect(useWishlistStore.getState().toggle("sol-dor")).toBe(true);
    expect(useWishlistStore.getState().ids).toEqual(["sol-dor"]);
    expect(useWishlistStore.getState().toggle("sol-dor")).toBe(false);
    expect(useWishlistStore.getState().ids).toEqual([]);
  });

  it("keeps the newest saved product first", () => {
    useWishlistStore.getState().toggle("a");
    useWishlistStore.getState().toggle("b");
    expect(useWishlistStore.getState().ids).toEqual(["b", "a"]);
  });

  it("removes one product without touching the others", () => {
    useWishlistStore.setState({ ids: ["a", "b", "c"] });
    useWishlistStore.getState().remove("b");
    expect(useWishlistStore.getState().ids).toEqual(["a", "c"]);
  });
});
