import { createInMemoryProductsService } from "@/features/products/services/products.in-memory";
import type {
  Product,
  ProductAvailability,
  ProductVariant,
} from "@/features/products/types/product.types";
import { sanityFetch, sanityImageUrl } from "@/lib/sanity/client";

/** Only what the storefront reads — taxonomies are flattened to their slugs. */
const PRODUCTS_QUERY = `*[_type == "product" && defined(slug.current)] | order(name asc) {
  "id": slug.current,
  sku,
  name,
  description,
  notes,
  scentNotes,
  variants[]{ "id": variantId, volume, label, price, inStock },
  giftWrappingAvailable,
  "images": images[].asset._ref,
  "category": category->slug.current,
  "scentFamily": scentFamily->slug.current,
  "occasion": occasion->slug.current,
  availability,
  ar
}`;

type SanityArabic = {
  name?: string | null;
  notes?: string | null;
  description?: string | null;
  scentNotes?: Partial<Product["scentNotes"]> | null;
} | null;

type SanityProduct = Omit<Partial<Product>, "images" | "variants" | "ar"> & {
  ar?: SanityArabic;
  images?: (string | null)[] | null;
  variants?: Partial<ProductVariant>[] | null;
};

const AVAILABILITY: ProductAvailability[] = [
  "in-stock",
  "made-to-order",
  "out-of-stock",
];

function toVariant(variant: Partial<ProductVariant>): ProductVariant | null {
  if (!variant.id || typeof variant.price !== "number") return null;
  const volume = variant.volume ?? 0;

  return {
    id: variant.id,
    volume,
    label: variant.label ?? `${volume} ml`,
    price: variant.price,
    inStock: variant.inStock !== false,
  };
}

/** Drops anything a half-filled dashboard entry would break the UI with. */
export function toProduct(document: SanityProduct): Product | null {
  if (!document.id || !document.name) return null;

  const variants = (document.variants ?? [])
    .map(toVariant)
    .filter((variant): variant is ProductVariant => variant !== null);
  if (variants.length === 0) return null;

  return {
    id: document.id,
    sku: document.sku ?? document.id.toUpperCase(),
    name: document.name,
    description: document.description ?? "",
    notes: document.notes ?? "",
    scentNotes: {
      top: document.scentNotes?.top ?? [],
      heart: document.scentNotes?.heart ?? [],
      base: document.scentNotes?.base ?? [],
    },
    variants,
    giftWrappingAvailable: document.giftWrappingAvailable ?? false,
    images: (document.images ?? [])
      .map((ref) => sanityImageUrl(ref))
      .filter((url): url is string => url !== null),
    category: document.category ?? "",
    scentFamily: document.scentFamily ?? "",
    occasion: document.occasion ?? "",
    ar: document.ar?.name
      ? {
          name: document.ar.name,
          notes: document.ar.notes ?? "",
          description: document.ar.description ?? "",
          scentNotes: {
            top: document.ar.scentNotes?.top ?? [],
            heart: document.ar.scentNotes?.heart ?? [],
            base: document.ar.scentNotes?.base ?? [],
          },
        }
      : undefined,
    availability: AVAILABILITY.includes(document.availability!)
      ? document.availability!
      : "in-stock",
  };
}

const CACHE_MS = 60_000;
let cached: { at: number; products: Promise<Product[]> } | null = null;

/** One request serves the listing, the detail page and related products. */
function loadCatalogue(): Promise<Product[]> {
  if (cached && Date.now() - cached.at < CACHE_MS) return cached.products;

  const products = sanityFetch<SanityProduct[]>(PRODUCTS_QUERY).then(
    (documents) =>
      documents
        .map(toProduct)
        .filter((product): product is Product => product !== null),
  );
  cached = { at: Date.now(), products };
  products.catch(() => {
    cached = null;
  });
  return products;
}

/** Catalogue managed by the business owner in the Sanity dashboard. */
export const sanityProductsService =
  createInMemoryProductsService(loadCatalogue);
