-- AlterTable
ALTER TABLE "User" ADD COLUMN     "preferredOperators" TEXT[] DEFAULT ARRAY[]::TEXT[];
