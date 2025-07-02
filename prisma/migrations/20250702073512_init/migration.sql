-- AlterTable
ALTER TABLE "User" ADD COLUMN     "otp" TEXT,
ADD COLUMN     "otpExpiry" TIMESTAMP(3),
ALTER COLUMN "loginCount" SET DEFAULT 0,
ALTER COLUMN "loginCount" DROP DEFAULT;
DROP SEQUENCE "User_loginCount_seq";
