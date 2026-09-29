import type { Metadata } from "next";
import { WishlistPage } from "@/features/wishlist";

export const metadata: Metadata = {
  title: "Wishlist",
  robots: { index: false },
};

export default function WishlistRoute() {
  return <WishlistPage />;
}
