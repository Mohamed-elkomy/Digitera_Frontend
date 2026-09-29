import type { Metadata } from "next";
import { OrderConfirmation } from "@/features/checkout";

export const metadata: Metadata = {
  title: "Your order",
  description: "Your Odoratus order confirmation.",
};

export default async function Page({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;

  return <OrderConfirmation orderId={decodeURIComponent(orderId)} />;
}
