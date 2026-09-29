import type { CartLine } from "@/features/cart";
import { getWrappingFee } from "@/features/cart/utils/gift-wrapping";
import type { Product } from "@/features/products";
import type { Order } from "@/features/checkout/types/checkout.types";
import { getShippingFee } from "@/features/checkout/utils/order";

export type OrderProblem =
  | "empty"
  | "unknown-product"
  | "unavailable"
  | "price-changed"
  | "bad-quantity";

export type VerifiedOrder =
  { ok: true; order: Order } | { ok: false; problems: OrderProblem[] };

/**
 * The browser sends the order, so nothing in it is trusted: every line is
 * checked against the live catalogue and the totals are recomputed here.
 */
export function verifyOrder(
  order: Order,
  findProduct: (id: string) => Product | null | undefined,
): VerifiedOrder {
  if (order.lines.length === 0) return { ok: false, problems: ["empty"] };

  const problems = new Set<OrderProblem>();
  const lines: CartLine[] = order.lines.map((line) => {
    const product = findProduct(line.productId);
    const variant = product?.variants.find(
      (entry) => entry.id === line.variantId,
    );
    if (!product || !variant) problems.add("unknown-product");
    else if (product.availability === "out-of-stock" || !variant.inStock) {
      problems.add("unavailable");
    } else if (variant.price !== line.unitPrice) problems.add("price-changed");

    if (
      !Number.isInteger(line.quantity) ||
      line.quantity < 1 ||
      line.quantity > 99
    ) {
      problems.add("bad-quantity");
    }
    return {
      ...line,
      giftWrapping:
        line.giftWrapping && Boolean(product?.giftWrappingAvailable),
    };
  });

  if (problems.size > 0) return { ok: false, problems: [...problems] };

  const subtotal = lines.reduce(
    (sum, line) => sum + line.unitPrice * line.quantity,
    0,
  );
  const shipping = getShippingFee(subtotal);
  const giftWrapping = getWrappingFee(lines, subtotal);

  return {
    ok: true,
    order: {
      ...order,
      lines,
      subtotal,
      shipping,
      giftWrapping,
      total: subtotal + shipping + giftWrapping,
    },
  };
}
