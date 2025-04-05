// lib/lessons/completeLessonAction.ts
import { db } from "@/lib/db"; // Prisma instance

export async function completeLessonAction(lessonId: string, userId: string) {
  try {
    // Check if the lesson exists
    const lesson = await db.lesson.findUnique({
      where: { id: lessonId },
    });

    if (!lesson) {
      throw new Error("Lesson not found");
    }

    // Check if the user has already completed the lesson
    const existingProgress = await db.userProgress.findFirst({
      where: {
        lessonId: lessonId,
        userId: userId,
      },
    });

    if (existingProgress && existingProgress.isCompleted) {
      throw new Error("Lesson already completed");
    }

    // Mark the lesson as completed
    await db.userProgress.upsert({
      where: {
        userId_lessonId: {
          userId,
          lessonId,
        },
      },
      update: {
        isCompleted: true,
      },
      create: {
        userId,
        lessonId,
        isCompleted: true,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error completing lesson:", error);
    return { success: false, error:"Failed to complete lesson" };
  }
}
