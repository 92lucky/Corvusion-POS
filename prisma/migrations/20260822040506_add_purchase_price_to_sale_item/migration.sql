/*
  Warnings:

  - Added the required column `purchasePrice` to the `SaleItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SaleItem" ADD COLUMN     "purchasePrice" DECIMAL(12,2) NOT NULL;
