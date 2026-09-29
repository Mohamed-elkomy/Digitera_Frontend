import type { Metadata } from "next";
import { CheckoutPage } from "@/features/checkout";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your Odoratus order.",
};

export default function Page() {
  // Guests can check out: an account is optional (it only prefills details
  // and keeps an order history).
  return <CheckoutPage />;
}
