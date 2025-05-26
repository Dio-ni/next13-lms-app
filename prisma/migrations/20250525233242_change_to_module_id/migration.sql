/*
  Warnings:

  - You are about to drop the column `chapterId` on the `quiz` table. All the data in the column will be lost.
  - You are about to drop the column `courseId` on the `quiz` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `quiz` DROP COLUMN `chapterId`,
    DROP COLUMN `courseId`,
    ADD COLUMN `moduleId` VARCHAR(191) NULL;
