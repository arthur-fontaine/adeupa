/*
  Warnings:

  - The primary key for the `Badge` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `_BadgeToItem` DROP FOREIGN KEY `_BadgeToItem_A_fkey`;

-- DropForeignKey
ALTER TABLE `_BadgeToQuest` DROP FOREIGN KEY `_BadgeToQuest_A_fkey`;

-- DropForeignKey
ALTER TABLE `_BadgeToTag` DROP FOREIGN KEY `_BadgeToTag_A_fkey`;

-- DropForeignKey
ALTER TABLE `_BadgeToUser` DROP FOREIGN KEY `_BadgeToUser_A_fkey`;

-- AlterTable
ALTER TABLE `Badge` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `_BadgeToItem` MODIFY `A` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `_BadgeToQuest` MODIFY `A` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `_BadgeToTag` MODIFY `A` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `_BadgeToUser` MODIFY `A` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `_BadgeToTag` ADD CONSTRAINT `_BadgeToTag_A_fkey` FOREIGN KEY (`A`) REFERENCES `Badge`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_BadgeToUser` ADD CONSTRAINT `_BadgeToUser_A_fkey` FOREIGN KEY (`A`) REFERENCES `Badge`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_BadgeToItem` ADD CONSTRAINT `_BadgeToItem_A_fkey` FOREIGN KEY (`A`) REFERENCES `Badge`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_BadgeToQuest` ADD CONSTRAINT `_BadgeToQuest_A_fkey` FOREIGN KEY (`A`) REFERENCES `Badge`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
