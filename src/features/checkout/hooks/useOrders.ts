"use client";

import { useSyncExternalStore } from "react";
import { useOrdersStore } from "@/features/checkout/store/orders.store";

function subscribe(onChange: () => void) {
  return useOrdersStore.persist.onFinishHydration(onChange);
}

export function useOrdersHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => useOrdersStore.persist.hasHydrated(),
    () => false,
  );
}

export function useOrders() {
  const stored = useOrdersStore((state) => state.orders);
  const placeOrder = useOrdersStore((state) => state.placeOrder);
  const hydrated = useOrdersHydrated();

  return {
    // Before hydration the list renders empty, matching the server markup.
    orders: hydrated ? stored : [],
    hydrated,
    placeOrder,
    findOrder: (id: string) => stored.find((order) => order.id === id),
  };
}
