// lib/usage.ts
import { prisma } from "./prisma";

const FREE_DAILY_BASE_REQUESTS = 3;

function today(): string {
  return new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
}

// Returns true if allowed (and records the request), false if over the limit.
// Pro users are always allowed and not counted.
export async function consumeBaseRequest(userId: string | null, isPro: boolean): Promise<boolean> {
  if (isPro) return true;
  if (!userId) return true; // signed-out: not gated here (optional to change later)

  const day = today();
  const row = await prisma.dailyUsage.findUnique({
    where: { userId_day: { userId, day } },
  });

  const used = row?.baseReqs ?? 0;
  if (used >= FREE_DAILY_BASE_REQUESTS) return false;

  await prisma.dailyUsage.upsert({
    where: { userId_day: { userId, day } },
    update: { baseReqs: used + 1 },
    create: { userId, day, baseReqs: 1 },
  });
  return true;
}