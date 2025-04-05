import { db } from "@/lib/db";  // Prisma database instance
import { Lesson, Course, Chapter } from "@prisma/client";

// Define the shape of the result
type LessonWithCourseAndChapter = {
  id: string;
  title: string;
  content: string | null;
  videoUrl: string | null;
  chapter: Chapter;
  course: Course;
};

export const getLessonById = async (id: string): Promise<LessonWithCourseAndChapter | null> => {
  try {
    const lesson = await db.lesson.findUnique({
      where: { id },
      include: {
        chapter: {
          include: {
            course: true,  // Include the course details
          },
        },
      },
    });

    if (!lesson) {
      return null;
    }

    // Construct the result with the required data
    const result: LessonWithCourseAndChapter = {
      id: lesson.id,
      title: lesson.title,
      content: lesson.content,
      videoUrl: lesson.videoUrl,
      chapter: lesson.chapter,  // Attach chapter details
      course: lesson.chapter.course,  // Attach course details through the chapter
    };

    return result;
  } catch (error) {
    console.error("Error fetching lesson:", error);
    return null;
  }
};
