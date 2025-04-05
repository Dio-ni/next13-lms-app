import { db } from "@/lib/db"; // Prisma client instance
export const getCourseProgress = async (
    userId: string,
    courseId: string
  ): Promise<{ completedLessons: { id: string }[]; courseProgress: number }> => {
    try {
      // Get all published chapters for the course
      const publishedChapters = await db.chapter.findMany({
        where: {
          courseId,
          isPublished: true,
        },
        select: {
          id: true,
        },
      });
  
      // If no published chapters exist, return early with 0 progress
      if (publishedChapters.length === 0) {
        return {
          completedLessons: [],
          courseProgress: 0,
        };
      }
  
      // Get the IDs of published chapters
      const publishedChaptersIds = publishedChapters.map((chapter) => chapter.id);
  
      // Get the completed lessons for the user
      const completedLessons = await db.userProgress.findMany({
        where: {
          userId,
          lessonId: {
            in: publishedChaptersIds,
          },
          isCompleted: true,
        },
        select: {
          lessonId: true, // Assuming this is the id of the completed lesson
        },
      });
  
      // Filter out any null lesson IDs before mapping
      const validCompletedLessons = completedLessons
        .filter((lesson) => lesson.lessonId !== null) // Remove lessons with null IDs
        .map((lesson) => ({ id: lesson.lessonId! })); // Assert that lessonId is now non-null
  
      // Calculate course progress percentage based on chapters
      const courseProgress = Math.round(
        (validCompletedLessons.length / publishedChapters.length) * 100
      );
  
      // Return the progress details
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
  