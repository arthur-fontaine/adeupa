/*
  Warnings:

  - You are about to drop the `UserSearchHistory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `UserSearchHistory` DROP FOREIGN KEY `UserSearchHistory_shopId_fkey`;

-- DropForeignKey
ALTER TABLE `UserSearchHistory` DROP FOREIGN KEY `UserSearchHistory_userId_fkey`;

-- DropTable
DROP TABLE `UserSearchHistory`;
