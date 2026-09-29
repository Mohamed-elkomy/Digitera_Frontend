import type { Product } from "@/features/products";
import type { Order } from "@/features/checkout/types/checkout.types";
import { verifyOrder } from "@/features/checkout/utils/order.verify";

const product = {
  id: "sol-dor",
  giftWrappingAvailable: true,
  availability: "in-stock",
  variants: [
    { id: "50ml", volume: 50, label: "50 ml", price: 150, inStock: true },
    { id: "30ml", volume: 30, label: "30 ml", price: 90, inStock: false },
  ],
} as Product;

const find = (id: string) => (id === "sol-dor" ? product : null);

const order = (overrides: Partial<Order["lines"][number]> = {}): Order => ({
  id: "ODR-1",
  ownerEmail: "",
  placedAt: "2026-09-29T10:00:00.000Z",
  lines: [
    {
      id: "l1",
      productId: "sol-dor",
      variantId: "50ml",
      name: "Sol d'Or",
      variantLabel: "50 ml",
      unitPrice: 150,
      giftWrapping: false,
      quantity: 2,
      ...overrides,
    },
  ],
  subtotal: 1,
  shipping: 999,
  giftWrapping: 0,
  total: 1,
  paymentMethod: "cash-on-delivery",
  shippingAddress: {
    fullName: "Salma",
    email: "",
    phone: "+20 100 000 0000",
    address: "12 Nile Street",
    city: "Cairo",
    postalCode: "",
    notes: "",
  },
});

describe("verifyOrder", () => {
  it("recomputes the totals instead of trusting the browser", () => {
    const result = verifyOrder(order(), find);
    expect(result.ok && result.order.subtotal).toBe(300);
    expect(result.ok && result.order.total).toBe(300);
  });

  it("rejects a tampered price", () => {
    expect(verifyOrder(order({ unitPrice: 1 }), find)).toEqual({
      ok: false,
      problems: ["price-changed"],
    });
  });

  it("rejects an out-of-stock size and an unknown product", () => {
    expect(
      verifyOrder(order({ variantId: "30ml", unitPrice: 90 }), find),
    ).toEqual({
      ok: false,
      problems: ["unavailable"],
    });
    expect(verifyOrder(order({ productId: "nope" }), find)).toEqual({
      ok: false,
      problems: ["unknown-product"],
    });
  });

  it("rejects impossible quantities", () => {
    expect(verifyOrder(order({ quantity: 0 }), find)).toEqual({
      ok: false,
      problems: ["bad-quantity"],
    });
  });
});
