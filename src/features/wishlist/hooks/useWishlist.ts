"use client";

import { useSyncExternalStore } from "react";
import { useWishlistStore } from "@/features/wishlist/store/wishlist.store";

function subscribe(onChange: () => void) {
  return useWishlistStore.persist.onFinishHydration(onChange);
}

/** Saved ids are restored after the first paint; render nothing saved until then. */
export function useWishlistHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => useWishlistStore.persist.hasHydrated(),
    () => false,
  );
}

export function useWishlist() {
  const ids = useWishlistStore((state) => state.ids);
  const toggle = useWishlistStore((state) => state.toggle);
  const remove = useWishlistStore((state) => state.remove);
  const hydrated = useWishlistHydrated();
  const visibleIds = hydrated ? ids : [];

  return {
    ids: visibleIds,
    count: visibleIds.length,
    hydrated,
    has: (productId: string) => visibleIds.includes(productId),
    toggle,
    remove,
  };
}
