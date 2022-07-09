-- CreateTable
CREATE TABLE `UserSearchHistory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `searchDate` DATETIME(3) NOT NULL,
    `shopId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,

    UNIQUE INDEX `UserSearchHistory_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserSearchHistory` ADD CONSTRAINT `UserSearchHistory_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserSearchHistory` ADD CONSTRAINT `UserSearchHistory_shopId_fkey` FOREIGN KEY (`shopId`) REFERENCES `Shop`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
