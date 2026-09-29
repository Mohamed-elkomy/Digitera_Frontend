import { NextResponse } from "next/server";
import { endSession } from "@/features/auth/server";

export async function POST() {
  await endSession();
  return NextResponse.json({ ok: true });
}
