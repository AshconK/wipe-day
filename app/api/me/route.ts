// app/api/me/route.ts
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/getUser";

export async function GET() {
  const user = await getCurrentUser();
  const plan = user?.plan ?? "free";
  return NextResponse.json({
    plan,
    isPro: plan === "pro" || plan === "clan", // both paid tiers count as "pro" for gating
  });
}