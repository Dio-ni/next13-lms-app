import { Category,  Course } from "@prisma/client";


// Fix: Make sure Lesson uses _id instead of id to be consistent with CompletedLesson
interface Lesson {
  id: string; // _id instead of id
  title: string;
  createdAt: Date;
  updatedAt: Date;
  content: string | null;
  videoUrl: string | null;
  chapterId: string;
}

interface Chapter {
  id: string; // `id` for chapters is fine, but lessons inside chapters need _id
  lessons: Lesson[]; // Lessons should use the correct interface with _id
}

export const calculateCourseProgress = (
  chapters: Chapter[], // List of chapters in the course
  completedLessons: { id: string; }[] // List of completed lessons
): number => {
  if (chapters.length === 0) {
    return 0; // If there are no chapters, return 0% progress
  }

  // Count the number of completed chapters
  const completedChapterCount = chapters.reduce((completedCount, chapter) => {
    const allLessonsCompleted = chapter.lessons.every((lesson) =>
      completedLessons.some(
        (completedLesson) => completedLesson.id === lesson.id // Ensure _id matching
      )
    );

    return allLessonsCompleted ? completedCount + 1 : completedCount;
  }, 0);

  // Calculate progress percentage
  const progressPercentage = (completedChapterCount / chapters.length) * 100;

  return parseFloat(progressPercentage.toFixed(2)); // Return the progress percentage rounded to 2 decimal places
};
