import { db } from "@/lib/db"; // Prisma client instance

export const getCourseProgress = async (
  userId: string,
  courseId: string
): Promise<{ completedLessons: { id: string }[]; courseProgress: number }> => {
  try {
    // Get all published lessons for the course
    const publishedLessons = await db.lesson.findMany({
      where: {
        chapter: {
          courseId,
        }
      },
      select: {
        id: true, // Selecting only the lesson IDs
      },
    });

    // If no published lessons exist, return early with 0 progress
    if (publishedLessons.length === 0) {
      return {
        completedLessons: [],
        courseProgress: 0,
      };
    }

    // Get the IDs of published lessons
    const publishedLessonIds = publishedLessons.map((lesson) => lesson.id);

    // Get the completed lessons for the user
    const completedLessons = await db.userProgress.findMany({
      where: {
        userId,
        lessonId: {
          in: publishedLessonIds,
        },
        isCompleted: true,
      },
      select: {
        lessonId: true, // Select lessonId of completed lessons
      },
    });

    // Filter out any null lesson IDs and map to the correct structure
    const validCompletedLessons = completedLessons
      .filter((lesson) => lesson.lessonId !== null) // Ensure lessonId is not null
      .map((lesson) => ({ id: lesson.lessonId! })); // Assure lessonId is non-null

    // Calculate course progress percentage based on lessons
    const courseProgress = Math.round(
      (validCompletedLessons.length / publishedLessons.length) * 100
    );

    return {
      completedLessons: validCompletedLessons,
      courseProgress,
    };
  } catch (error) {
    console.error("Error getting course progress: ", error);
    return {
      completedLessons: [],
      courseProgress: 0,
    };
  }
};
