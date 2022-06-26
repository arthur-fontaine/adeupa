/*
  Warnings:

  - The values [LandscapeSkyColor] on the enum `Item_type` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `Item` MODIFY `type` ENUM('CharacterColor', 'CharacterClothes', 'LandscapeDistrict') NOT NULL;

-- AlterTable
ALTER TABLE `Shop` ADD COLUMN `type` ENUM('Flower', 'Food', 'Toy', 'Other') NULL;
