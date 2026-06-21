// app/api/saved/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

// GET — return the signed-in user's saved bases
export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ bases: [] });

  const rows = await prisma.savedBase.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ bases: rows });
}

// POST — save a base  { baseId, baseName }
export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const { baseId, baseName } = await req.json();

  // already saved? treat as success, no double-count
  const existing = await prisma.savedBase.findFirst({ where: { userId, baseId } });
  if (existing) return NextResponse.json({ ok: true });

  // check the free-tier cap
  const user = await prisma.user.findUnique({ where: { id: userId } });
  const isPro = user?.isPro ?? false;

  if (!isPro) {
    const count = await prisma.savedBase.count({ where: { userId } });
    if (count >= 2) {
      return NextResponse.json(
        { error: "limit", message: "Free users can save up to 2 bases. Upgrade to Pro for unlimited." },
        { status: 403 }
      );
    }
  }

  await prisma.savedBase.create({ data: { userId, baseId, baseName } });
  return NextResponse.json({ ok: true });
}

// DELETE — remove a saved base  ?baseId=...
export async function DELETE(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const baseId = searchParams.get("baseId");
  if (!baseId) return NextResponse.json({ error: "Missing baseId" }, { status: 400 });

  await prisma.savedBase.deleteMany({ where: { userId, baseId } });
  return NextResponse.json({ ok: true });
}