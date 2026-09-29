import type { CartLine } from "@/features/cart";
import type {
  Order,
  PaymentMethod,
} from "@/features/checkout/types/checkout.types";

const text = (value: unknown, max = 500) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";
const num = (value: unknown) =>
  typeof value === "number" ? value : Number.NaN;
const record = (value: unknown): Record<string, unknown> =>
  typeof value === "object" && value !== null
    ? (value as Record<string, unknown>)
    : {};

/** Rebuilds an order from untrusted JSON, keeping only known fields. */
export function parseOrder(body: unknown): Order | null {
  const input = record(body);
  const address = record(input.shippingAddress);
  if (!Array.isArray(input.lines) || input.lines.length > 50) return null;

  const lines: CartLine[] = input.lines.map((raw) => {
    const line = record(raw);
    return {
      id: text(line.id, 200),
      productId: text(line.productId, 100),
      variantId: text(line.variantId, 50),
      name: text(line.name, 120),
      variantLabel: text(line.variantLabel, 50),
      unitPrice: num(line.unitPrice),
      giftWrapping: line.giftWrapping === true,
      quantity: num(line.quantity),
    };
  });

  const paymentMethod: PaymentMethod =
    input.paymentMethod === "bank-transfer"
      ? "bank-transfer"
      : "cash-on-delivery";
  const id = text(input.id, 40);
  if (!/^ODR-[A-Z0-9-]+$/.test(id)) return null;

  return {
    id,
    ownerEmail: text(input.ownerEmail, 200),
    placedAt: new Date().toISOString(),
    lines,
    subtotal: 0,
    shipping: 0,
    giftWrapping: 0,
    total: 0,
    paymentMethod,
    shippingAddress: {
      fullName: text(address.fullName, 120),
      email: text(address.email, 200),
      phone: text(address.phone, 30),
      address: text(address.address),
      city: text(address.city, 80),
      postalCode: text(address.postalCode, 12),
      notes: text(address.notes, 1000),
    },
  };
}
