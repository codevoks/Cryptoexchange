/*
  Warnings:

  - You are about to drop the column `makerOrderId` on the `Trade` table. All the data in the column will be lost.
  - You are about to drop the column `pair` on the `Trade` table. All the data in the column will be lost.
  - You are about to drop the column `takerOrderId` on the `Trade` table. All the data in the column will be lost.
  - Added the required column `buyerOrderId` to the `Trade` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sellerOrderId` to the `Trade` table without a default value. This is not possible if the table is not empty.
  - Added the required column `side` to the `Trade` table without a default value. This is not possible if the table is not empty.
  - Added the required column `symbol` to the `Trade` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TradeSide" AS ENUM ('BUY', 'SELL');

-- DropIndex
DROP INDEX "Trade_makerOrderId_idx";

-- DropIndex
DROP INDEX "Trade_takerOrderId_idx";

-- AlterTable
ALTER TABLE "Trade" DROP COLUMN "makerOrderId",
DROP COLUMN "pair",
DROP COLUMN "takerOrderId",
ADD COLUMN     "buyerOrderId" TEXT NOT NULL,
ADD COLUMN     "sellerOrderId" TEXT NOT NULL,
ADD COLUMN     "side" "TradeSide" NOT NULL,
ADD COLUMN     "symbol" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Trade_buyerOrderId_idx" ON "Trade"("buyerOrderId");

-- CreateIndex
CREATE INDEX "Trade_sellerOrderId_idx" ON "Trade"("sellerOrderId");
