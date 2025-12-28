-- AlterTable
ALTER TABLE "user" ADD COLUMN     "phone" TEXT,
ADD COLUMN     "role" TEXT DEFAULT 'USER',
ADD COLUMN     "status" TEXT DEFAULT 'ACTIVE';
