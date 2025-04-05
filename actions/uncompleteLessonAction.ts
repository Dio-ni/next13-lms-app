// lib/lessons/uncompleteLessonAction.ts
import { db } from "@/lib/db"; // Prisma instance

export async function uncompleteLessonAction(
  lessonId: string,
  userId: string
) {
  try {
    // Find the lesson progress record
    const existingProgress = await db.userProgress.findFirst({
      where: {
        lessonId: lessonId,
        userId: userId,
      },
    });

    if (!existingProgress || !existingProgress.isCompleted) {
      throw new Error("Lesson not completed or already uncompleted");
    }

    // Mark the lesson as incomplete by updating the progress record
    await db.userProgress.update({
      where: {
        id: existingProgress.id,
      },
      data: {
        isCompleted: false,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error uncompleting lesson:", error);
    throw error;
  }
}
