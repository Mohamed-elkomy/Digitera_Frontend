import { NextResponse } from "next/server";
import { productsService } from "@/features/products";

type Context = { params: Promise<{ productId: string }> };

export async function GET(request: Request, { params }: Context) {
  const { productId } = await params;
  const limit = Number(new URL(request.url).searchParams.get("limit")) || 4;
  try {
    return NextResponse.json(
      await productsService.listRelated(productId, Math.min(limit, 12)),
    );
  } catch {
    return NextResponse.json({ error: "unavailable" }, { status: 503 });
  }
}
