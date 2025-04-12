import { db } from "@/lib/db";  // Prisma database instance
import { Lesson, Course, Chapter, Module } from "@prisma/client";

// Define the shape of the result
type LessonWithCourseAndChapter = {
  id: string;
  title: string;
  content: string | null;
  videoUrl: string | null;
  chapter: Chapter;
  course: Course | null;  // Make course nullable
  module: Module | null;  // Make module nullable
};

export const getLessonById = async (id: string): Promise<LessonWithCourseAndChapter | null> => {
  try {
    const lesson = await db.lesson.findUnique({
      where: { id },
      include: {
        chapter: {
          include: {
            module: {  // Include the module details
              include: {
                course: true,  // Include the course details
              },
            },
          },
        },
      },
    });

    if (!lesson || !lesson.chapter.module) {
      return null;
    }

    // Construct the result with the required data
    const result: LessonWithCourseAndChapter = {
      id: lesson.id,
      title: lesson.title,
      content: lesson.content,
      videoUrl: lesson.videoUrl,
      chapter: lesson.chapter,  // Attach chapter details
      course: lesson.chapter.module?.course || null,  // Attach course details (null-safe)
      module: lesson.chapter.module,  // Attach module details (null-safe)
    };

    return result;
  } catch (error) {
    console.error("Error fetching lesson:", error);
    return null;
  }
};
