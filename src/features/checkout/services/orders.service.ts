import { env } from "@/config/env";
import type { Order } from "@/features/checkout/types/checkout.types";

/**
 * Sends a placed order to the owner's dashboard. The WhatsApp invoice is the
 * customer-facing channel; this is the owner's record of it. In demo mode
 * (mock data) there is no backend, so nothing is sent.
 */
export async function saveOrder(order: Order): Promise<void> {
  if (env.useMockApi) return;

  const response = await fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(order),
  });
  if (!response.ok) throw new Error(`Order failed: ${response.status}`);
}
