-- CreateTable
CREATE TABLE `_CodeToUser` (
    `A` VARCHAR(191) NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_CodeToUser_AB_unique`(`A`, `B`),
    INDEX `_CodeToUser_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_CodeToUser` ADD CONSTRAINT `_CodeToUser_A_fkey` FOREIGN KEY (`A`) REFERENCES `Code`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CodeToUser` ADD CONSTRAINT `_CodeToUser_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
