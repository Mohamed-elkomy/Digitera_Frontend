"use client";

import { useSyncExternalStore } from "react";
import { useQuery } from "@tanstack/react-query";
import { env } from "@/config/env";
import { useSession } from "@/features/auth";
import { listMyOrders } from "@/features/checkout/services/orders.service";
import type { Order } from "@/features/checkout/types/checkout.types";
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
  const { user } = useSession();

  // Two people can sign in on one browser, so an order only belongs to the
  // account that placed it.
  const local = user
    ? stored.filter((order) => order.ownerEmail === user.email)
    : [];

  // With a live backend the account's orders come from the database too, so
  // they follow the customer to any device.
  const remote = useQuery({
    queryKey: ["orders", "mine", user?.email],
    queryFn: listMyOrders,
    enabled: Boolean(user) && !env.useMockApi,
  });
  const mine = mergeOrders(remote.data ?? [], local);

  return {
    // Before hydration the list renders empty, matching the server markup.
    orders: hydrated ? mine : [],
    hydrated,
    placeOrder,
    // A guest can still open the confirmation of an order placed in this browser.
    findOrder: (id: string) =>
      (user ? mine : stored).find((order) => order.id === id),
  };
}

/** Database copies win; orders only in this browser are kept. Newest first. */
export function mergeOrders(remote: Order[], local: Order[]): Order[] {
  const byId = new Map<string, Order>();
  for (const order of local) byId.set(order.id, order);
  for (const order of remote) byId.set(order.id, order);
  return [...byId.values()].sort((a, b) =>
    b.placedAt.localeCompare(a.placedAt),
  );
}
