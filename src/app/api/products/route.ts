import { NextResponse } from "next/server";
import {
  parseProductListQuery,
  productsService,
  type ProductSearchParams,
} from "@/features/products";

/** The catalogue for the browser, read from Sanity on the server. */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const params: ProductSearchParams = {};
  for (const key of new Set(url.searchParams.keys())) {
    const values = url.searchParams.getAll(key);
    params[key] = values.length > 1 ? values : values[0];
  }

  try {
    return NextResponse.json(
      await productsService.list(parseProductListQuery(params)),
    );
  } catch {
    return NextResponse.json({ error: "unavailable" }, { status: 503 });
  }
}
