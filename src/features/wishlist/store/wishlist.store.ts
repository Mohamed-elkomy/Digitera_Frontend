"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type WishlistStore = {
  /** Saved product ids, newest first. */
  ids: string[];
  toggle: (productId: string) => boolean;
  remove: (productId: string) => void;
};

/**
 * Only ids are stored: prices, stock and names always come from the live
 * catalogue, so a saved fragrance never shows a stale price.
 */
export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (productId) => {
        const saved = get().ids.includes(productId);
        set((state) => ({
          ids: saved
            ? state.ids.filter((id) => id !== productId)
            : [productId, ...state.ids],
        }));
        return !saved;
      },
      remove: (productId) =>
        set((state) => ({ ids: state.ids.filter((id) => id !== productId) })),
    }),
    { name: "odoratus-wishlist" },
  ),
);
