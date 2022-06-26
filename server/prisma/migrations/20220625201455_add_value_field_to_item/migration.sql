/*
  Warnings:

  - The values [CharacterHead,CharacterAnimation] on the enum `Item_type` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `value` to the `Item` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Item` ADD COLUMN `value` VARCHAR(191) NOT NULL,
    MODIFY `type` ENUM('CharacterColor', 'CharacterClothes', 'LandscapeSkyColor', 'LandscapeDistrict') NOT NULL;
