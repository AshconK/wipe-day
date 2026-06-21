// lib/getUser.ts
import { auth } from "@clerk/nextjs/server";
import { prisma } from "./prisma";

// Returns the signed-in user's record, creating it on first sight.
// Use this on the server to know who they are and whether they're Pro.
export async function getCurrentUser() {
  const { userId } = await auth();
  if (!userId) return null;

  let user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    user = await prisma.user.create({ data: { id: userId } });
  }
  return user; // { id, isPro, createdAt }
}