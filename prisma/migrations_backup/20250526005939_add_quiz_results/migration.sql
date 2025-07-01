-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- -- CreateTable
-- CREATE TABLE "Course" (
--     "id" TEXT NOT NULL,
--     "userId" TEXT NOT NULL,
--     "title" TEXT NOT NULL,
--     "description" TEXT,
--     "imageUrl" TEXT,
--     "isPublished" BOOLEAN NOT NULL DEFAULT false,
--     "categoryId" TEXT,
--     "certificateEnabled" BOOLEAN NOT NULL DEFAULT false,
--     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
--     "updatedAt" TIMESTAMP(3) NOT NULL,

--     CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
-- );

-- -- CreateTable
-- CREATE TABLE "Module" (
--     "id" TEXT NOT NULL,
--     "title" TEXT NOT NULL,
--     "position" INTEGER NOT NULL DEFAULT 0,
--     "courseId" TEXT NOT NULL,
--     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
--     "updatedAt" TIMESTAMP(3) NOT NULL,

--     CONSTRAINT "Module_pkey" PRIMARY KEY ("id")
-- );

-- -- CreateTable
-- CREATE TABLE "Chapter" (
--     "id" TEXT NOT NULL,
--     "title" TEXT NOT NULL,
--     "position" INTEGER NOT NULL,
--     "moduleId" TEXT,
--     "courseId" TEXT NOT NULL,
--     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
--     "updatedAt" TIMESTAMP(3) NOT NULL,

--     CONSTRAINT "Chapter_pkey" PRIMARY KEY ("id")
-- );

-- -- CreateTable
-- CREATE TABLE "Lesson" (
--     "id" TEXT NOT NULL,
--     "title" TEXT NOT NULL,
--     "content" TEXT,
--     "videoUrl" TEXT,
--     "imageUrl" TEXT,
--     "chapterId" TEXT NOT NULL,
--     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
--     "updatedAt" TIMESTAMP(3) NOT NULL,

--     CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id")
-- );

-- -- CreateTable
-- CREATE TABLE "Quiz" (
--     "id" TEXT NOT NULL,
--     "title" TEXT NOT NULL,
--     "chapterId" TEXT NOT NULL,
--     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
--     "updatedAt" TIMESTAMP(3) NOT NULL,

--     CONSTRAINT "Quiz_pkey" PRIMARY KEY ("id")
-- );

-- -- CreateTable
-- CREATE TABLE "Question" (
--     "id" TEXT NOT NULL,
--     "text" TEXT NOT NULL,
--     "quizId" TEXT NOT NULL,
--     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
--     "updatedAt" TIMESTAMP(3) NOT NULL,

--     CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
-- );

-- -- CreateTable
-- CREATE TABLE "QuizOption" (
--     "id" TEXT NOT NULL,
--     "text" TEXT NOT NULL,
--     "isCorrect" BOOLEAN NOT NULL,
--     "questionId" TEXT NOT NULL,
--     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
--     "updatedAt" TIMESTAMP(3) NOT NULL,

--     CONSTRAINT "QuizOption_pkey" PRIMARY KEY ("id")
-- );

-- -- CreateTable
CREATE TABLE "UserProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "lessonId" TEXT,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserProgress_pkey" PRIMARY KEY ("id")
);

-- -- CreateTable
CREATE TABLE "Enrollment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Enrollment_pkey" PRIMARY KEY ("id")
);

-- -- CreateTable
-- CREATE TABLE "Attachment" (
--     "id" TEXT NOT NULL,
--     "name" TEXT NOT NULL,
--     "url" TEXT NOT NULL,
--     "courseId" TEXT NOT NULL,
--     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
--     "updatedAt" TIMESTAMP(3) NOT NULL,

--     CONSTRAINT "Attachment_pkey" PRIMARY KEY ("id")
-- );

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "UserProgress_userId_lessonId_key" ON "UserProgress"("userId", "lessonId");

-- CreateIndex
CREATE UNIQUE INDEX "Enrollment_userId_courseId_key" ON "Enrollment"("userId", "courseId");
