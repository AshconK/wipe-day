// app/api/me/route.ts
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/getUser";

export async function GET() {
  const user = await getCurrentUser();
  return NextResponse.json({ isPro: user?.isPro ?? false });
}