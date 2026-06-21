-- CreateTable
CREATE TABLE "SavedBase" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "baseId" TEXT NOT NULL,
    "baseName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedBase_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SavedBase_userId_idx" ON "SavedBase"("userId");
