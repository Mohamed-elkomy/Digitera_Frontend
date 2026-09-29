import type { Review } from "@/features/reviews/types/review.types";

type Template = Omit<Review, "id" | "productId">;

/** Client voices, in both of the shop's languages. */
const templates: Template[] = [
  {
    author: "Salma H.",
    rating: 5,
    comment:
      "Lasts the whole day and I get asked about it every time. The gift wrapping was beautiful.",
    createdAt: "2026-08-14",
  },
  {
    author: "Omar K.",
    rating: 5,
    comment: "ريحة فخمة جداً وثباتها ممتاز، والتغليف كان هدية لوحده.",
    createdAt: "2026-08-02",
  },
  {
    author: "Nour A.",
    rating: 4,
    comment:
      "Elegant and not overpowering. I wish the 30 ml came in a travel case.",
    createdAt: "2026-07-21",
  },
  {
    author: "Youssef M.",
    rating: 5,
    comment:
      "Bought it as a wedding gift — the WhatsApp ordering was quick and the reply came within the hour.",
    createdAt: "2026-07-09",
  },
  {
    author: "مريم ع.",
    rating: 4,
    comment: "العطر هادي وراقي، بس كنت أتمنى يكون أقوى شوية في الأول.",
    createdAt: "2026-06-30",
  },
  {
    author: "Karim S.",
    rating: 5,
    comment:
      "The dry-down is the best part. Warm, clean and very long-lasting.",
    createdAt: "2026-06-18",
  },
  {
    author: "Hana R.",
    rating: 3,
    comment:
      "Beautiful bottle and a lovely opening, but it fades faster than I expected on me.",
    createdAt: "2026-06-04",
  },
  {
    author: "أحمد ف.",
    rating: 5,
    comment: "أحسن عطر اشتريته السنة دي، والتوصيل كان سريع.",
    createdAt: "2026-05-27",
  },
  {
    author: "Laila T.",
    rating: 4,
    comment: "Very refined. Perfect for the office and for evenings.",
    createdAt: "2026-05-11",
  },
  {
    author: "Mostafa E.",
    rating: 5,
    comment: "My second bottle. Nothing else smells quite like it.",
    createdAt: "2026-04-29",
  },
];

/** A stable, product-specific pick so every page shows the same reviews. */
function seedFor(productId: string): number {
  return [...productId].reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

export function mockReviewsFor(productId: string): Review[] {
  const seed = seedFor(productId);
  const count = 2 + (seed % 3);

  return Array.from({ length: count }, (_, index) => {
    const template = templates[(seed + index * 3) % templates.length];
    return { ...template, id: `${productId}-review-${index + 1}`, productId };
  });
}
