import { NextResponse } from "next/server";
import {
  hasCheckoutErrors,
  parseOrder,
  validateCheckout,
  verifyOrder,
} from "@/features/checkout";
import { productsService, type Product } from "@/features/products";
import { isSanityConfigured, sanityCreate } from "@/lib/sanity/client";

/**
 * Records an order in the owner's dashboard. Prices, stock and totals are
 * re-checked against the live catalogue; the write token stays on the server.
 */
export async function POST(request: Request) {
  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!token || !isSanityConfigured()) {
    return NextResponse.json({ error: "not-configured" }, { status: 503 });
  }

  const order = parseOrder(await request.json().catch(() => null));
  if (!order) return NextResponse.json({ error: "invalid" }, { status: 400 });

  const errors = validateCheckout({
    ...order.shippingAddress,
    paymentMethod: order.paymentMethod,
  });
  if (hasCheckoutErrors(errors)) {
    return NextResponse.json({ errors }, { status: 422 });
  }

  const products = new Map<string, Product | null>();
  for (const { productId } of order.lines) {
    if (!products.has(productId)) {
      products.set(productId, await productsService.getById(productId));
    }
  }

  const verified = verifyOrder(order, (id) => products.get(id));
  if (!verified.ok) {
    return NextResponse.json({ problems: verified.problems }, { status: 409 });
  }

  const { lines, shippingAddress: customer, ...totals } = verified.order;
  try {
    await sanityCreate(
      {
        _id: `order-${order.id}`,
        _type: "order",
        orderNumber: order.id,
        status: "new",
        placedAt: totals.placedAt,
        paymentMethod: totals.paymentMethod,
        customer,
        items: lines.map((line) => ({
          _key: line.id.replace(/[^a-zA-Z0-9_-]/g, "-").slice(0, 60),
          _type: "orderItem",
          productSlug: line.productId,
          name: line.name,
          size: line.variantLabel,
          quantity: line.quantity,
          unitPrice: line.unitPrice,
          giftWrapping: line.giftWrapping,
        })),
        subtotal: totals.subtotal,
        shipping: totals.shipping,
        giftWrapping: totals.giftWrapping,
        total: totals.total,
      },
      token,
    );
  } catch {
    return NextResponse.json({ error: "store-failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
