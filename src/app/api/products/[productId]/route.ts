import { NextResponse } from "next/server";
import { productsService } from "@/features/products";

type Context = { params: Promise<{ productId: string }> };

export async function GET(_request: Request, { params }: Context) {
  const { productId } = await params;
  try {
    const product = await productsService.getById(productId);
    return product
      ? NextResponse.json(product)
      : NextResponse.json(null, { status: 404 });
  } catch {
    return NextResponse.json({ error: "unavailable" }, { status: 503 });
  }
}
