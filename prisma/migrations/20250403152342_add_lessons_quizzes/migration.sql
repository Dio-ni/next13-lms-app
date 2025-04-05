/*
  Warnings:

  - You are about to drop the column `description` on the `chapter` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `chapter` table. All the data in the column will be lost.
  - You are about to drop the column `videoUrl` on the `chapter` table. All the data in the column will be lost.
  - You are about to drop the column `chapterId` on the `userprogress` table. All the data in the column will be lost.
  - You are about to drop the `_attachmenttocourse` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `muxdata` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId,lessonId]` on the table `UserProgress` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `Attachment_courseId_idx` ON `attachment`;

-- DropIndex
DROP INDEX `Course_categoryId_idx` ON `course`;

-- DropIndex
DROP INDEX `Enrollment_courseId_idx` ON `enrollment`;

-- DropIndex
DROP INDEX `UserProgress_chapterId_idx` ON `userprogress`;

-- DropIndex
DROP INDEX `UserProgress_userId_chapterId_key` ON `userprogress`;

-- AlterTable
ALTER TABLE `chapter` DROP COLUMN `description`,
    DROP COLUMN `imageUrl`,
    DROP COLUMN `videoUrl`;

-- AlterTable
ALTER TABLE `userprogress` DROP COLUMN `chapterId`,
    ADD COLUMN `lessonId` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `_attachmenttocourse`;

-- DropTable
DROP TABLE `muxdata`;

-- CreateTable
CREATE TABLE `Lesson` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `content` TEXT NULL,
    `videoUrl` TEXT NULL,
    `chapterId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Quiz` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `chapterId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Question` (
    `id` VARCHAR(191) NOT NULL,
    `text` VARCHAR(191) NOT NULL,
    `quizId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Option` (
    `id` VARCHAR(191) NOT NULL,
    `text` VARCHAR(191) NOT NULL,
    `isCorrect` BOOLEAN NOT NULL,
    `questionId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `UserProgress_userId_lessonId_key` ON `UserProgress`(`userId`, `lessonId`);
