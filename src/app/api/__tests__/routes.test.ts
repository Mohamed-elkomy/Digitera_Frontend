/**
 * @jest-environment node
 */
const sanityCreate = jest.fn().mockResolvedValue(undefined);
jest.mock("@/lib/sanity/client", () => ({
  isSanityConfigured: () => true,
  sanityCreate: (...args: unknown[]) => sanityCreate(...args),
  sanityFetch: jest.fn().mockResolvedValue("product-sol-dor"),
  sanityImageUrl: () => null,
}));

import { POST as postOrder } from "@/app/api/orders/route";
import { POST as postInquiry } from "@/app/api/inquiries/route";
import { POST as postReview } from "@/app/api/reviews/route";

const json = (body: unknown) =>
  new Request("http://localhost/api", {
    method: "POST",
    body: JSON.stringify(body),
  });

const order = (unitPrice: number) => ({
  id: "ODR-TEST-1",
  lines: [
    {
      id: "sol-dor__100ml",
      productId: "sol-dor",
      variantId: "100ml",
      name: "Sol d'Or",
      variantLabel: "100 ml",
      unitPrice,
      giftWrapping: false,
      quantity: 1,
    },
  ],
  paymentMethod: "cash-on-delivery",
  shippingAddress: {
    fullName: "Salma",
    email: "",
    phone: "+20 100 000 0000",
    address: "12 Nile Street, Maadi",
    city: "Cairo",
    postalCode: "",
    notes: "",
  },
});

beforeEach(() => {
  sanityCreate.mockClear();
  process.env.SANITY_API_WRITE_TOKEN = "test-token";
});

describe("POST /api/orders", () => {
  it("stores a valid order with totals recomputed on the server", async () => {
    const response = await postOrder(json(order(185)));
    expect(response.status).toBe(201);
    const [document] = sanityCreate.mock.calls[0];
    expect(document).toMatchObject({
      _type: "order",
      status: "new",
      subtotal: 185,
      total: 185,
    });
  });

  it("rejects a tampered price without storing anything", async () => {
    const response = await postOrder(json(order(1)));
    expect(response.status).toBe(409);
    expect(sanityCreate).not.toHaveBeenCalled();
  });

  it("answers 503 when the backend is not configured", async () => {
    delete process.env.SANITY_API_WRITE_TOKEN;
    expect((await postOrder(json(order(185)))).status).toBe(503);
  });
});

it("stores a valid inquiry and rejects an invalid one", async () => {
  const ok = await postInquiry(
    json({
      name: "Salma",
      email: "s@example.com",
      subject: "Gifts",
      message: "Twenty gift sets please.",
    }),
  );
  expect(ok.status).toBe(201);
  expect((await postInquiry(json({ name: "" }))).status).toBe(422);
});

it("stores a new review hidden until the owner approves it", async () => {
  const response = await postReview(
    json({
      productId: "sol-dor",
      author: "Omar",
      rating: 5,
      comment: "Beautiful and long-lasting.",
    }),
  );
  expect(response.status).toBe(201);
  expect(sanityCreate.mock.calls[0][0]).toMatchObject({
    _type: "review",
    approved: false,
    product: { _ref: "product-sol-dor" },
  });
});
